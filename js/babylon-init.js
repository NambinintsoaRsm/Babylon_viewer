export let engine = null;
export let scene = null;
export let camera = null;
export let currentMode = 'souris'; // 'souris' ou 'clavier'
const initialCameraPosition = new BABYLON.Vector3(0, 5, -20);

// Classe d'initialisation de Babylon.js
export function initBabylon() {
    const canvas = document.getElementById('renderCanvas');

    engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
    });

    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0.96, 0.95, 0.94, 1.0);

    // Créer la caméra mobile
    camera = creerCameraMobile(scene, canvas);

    const hemi = new BABYLON.HemisphericLight(
        'light',
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    hemi.intensity = 0.8;

    const dir = new BABYLON.DirectionalLight(
        'dirLight',
        new BABYLON.Vector3(-1, -2, -1),
        scene
    );
    dir.intensity = 0.5;

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    // Activer le mode souris par défaut
    activerModeSouris(camera, canvas);
}

// Fonction pour la caméra

// just pour savoir si on est en souris ou en clavier
export function switchCamera() {
    const canvas = document.getElementById('renderCanvas');
    if (currentMode === 'souris') {
        currentMode = 'clavier';
        activerModeClavier(camera, canvas);
    } else {
        currentMode = 'souris';
        activerModeSouris(camera, canvas);
    }
}

// revenir à la position initiale
export function resetCamera() {
    camera.position = initialCameraPosition.clone();
    camera.rotation = new BABYLON.Vector3(0, 0, 0);
}

// CAMÉRA MOBILE

function creerCameraMobile(scene, canvas) {
    const camera = new BABYLON.FreeCamera(
        "cameraMobile",
        initialCameraPosition.clone(),
        scene
    );

    camera.attachControl(canvas, true);

    camera.speed = 0.9;
    camera.inertia = 0.9;
    camera.angularSensibility = 2700;

    return camera;
}

// MODE CLAVIER

function activerModeClavier(camera, canvas) {
    desactiverModeSouris(camera, canvas);

    camera.attachControl(canvas, true);

    camera.inputs.removeByType("FreeCameraMouseInput");
    camera.inputs.removeByType("FreeCameraTouchInput");

    if (!camera.inputs.attached.keyboard) {
        camera.inputs.addKeyboard();
    }

    camera.keysUp = [90];    // Z
    camera.keysDown = [83];  // S
    camera.keysLeft = [81];  // Q
    camera.keysRight = [68]; // D

    activerRegardClavier(camera, canvas);
}

function activerRegardClavier(camera, canvas) {
    const scene = camera.getScene();
    desactiverRegardClavier(camera);

    const etatTouches = { gauche: false, droite: false, haut: false, bas: false };

    const onKeyDown = (e) => {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            e.preventDefault();
        }
        if (e.key === "ArrowLeft") etatTouches.gauche = true;
        if (e.key === "ArrowRight") etatTouches.droite = true;
        if (e.key === "ArrowUp") etatTouches.haut = true;
        if (e.key === "ArrowDown") etatTouches.bas = true;
    };

    const onKeyUp = (e) => {
        if (e.key === "ArrowLeft") etatTouches.gauche = false;
        if (e.key === "ArrowRight") etatTouches.droite = false;
        if (e.key === "ArrowUp") etatTouches.haut = false;
        if (e.key === "ArrowDown") etatTouches.bas = false;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    const vitesseRotation = 0.03;

    const observer = scene.onBeforeRenderObservable.add(() => {
        if (etatTouches.gauche) camera.rotation.y -= vitesseRotation;
        if (etatTouches.droite) camera.rotation.y += vitesseRotation;

        if (etatTouches.haut) camera.rotation.x -= vitesseRotation;
        if (etatTouches.bas) camera.rotation.x += vitesseRotation;

        const limite = Math.PI / 2 - 0.01;
        camera.rotation.x = Math.max(-limite, Math.min(limite, camera.rotation.x));
    });

    camera.__regardClavier = { onKeyDown, onKeyUp, observer };
}

function desactiverRegardClavier(camera) {
    const scene = camera.getScene();
    const data = camera.__regardClavier;
    if (!data) return;

    window.removeEventListener("keydown", data.onKeyDown);
    window.removeEventListener("keyup", data.onKeyUp);
    scene.onBeforeRenderObservable.remove(data.observer);
    camera.__regardClavier = null;
}

// MODE SOURIS ou trackpad

function activerModeSouris(camera, canvas) {
    desactiverRegardClavier(camera);

    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");
    camera.inputs.removeByType("FreeCameraTouchInput");

    camera.attachControl(canvas, true);

    activerControleTrackpad(camera, canvas);
}

function activerControleTrackpad(camera, canvas) {
    desactiverModeSouris(camera, canvas);

    let surCanvas = false;

    const onEnter = () => (surCanvas = true);
    const onLeave = () => (surCanvas = false);

    const sensibiliteRotation = 0.0025;

    const onMouseMove = (e) => {
        if (!surCanvas) return;

        const dx = e.movementX || 0;
        const dy = e.movementY || 0;

        camera.rotation.y += dx * sensibiliteRotation;
        camera.rotation.x += dy * sensibiliteRotation;

        const limite = Math.PI / 2 - 0.01;
        camera.rotation.x = Math.max(-limite, Math.min(limite, camera.rotation.x));
    };

    const vitesse = 0.02;

    const onWheel = (e) => {
        e.preventDefault();

        const dx = e.deltaX;
        const dy = e.deltaY;

        const avant = camera.getDirection(BABYLON.Vector3.Forward());
        const droite = camera.getDirection(BABYLON.Vector3.Right());

        camera.position.addInPlace(avant.scale(-dy * vitesse));
        camera.position.addInPlace(droite.scale(dx * vitesse));
    };

    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    camera.__controleSouris = { onEnter, onLeave, onMouseMove, onWheel };
}

function desactiverModeSouris(camera, canvas) {
    const data = camera.__controleSouris;
    if (!data) return;

    canvas.removeEventListener("mouseenter", data.onEnter);
    canvas.removeEventListener("mouseleave", data.onLeave);
    canvas.removeEventListener("mousemove", data.onMouseMove);
    canvas.removeEventListener("wheel", data.onWheel);

    camera.__controleSouris = null;
}
