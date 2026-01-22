const canvas = document.getElementById("renderCanvas");
canvas.tabIndex = 1;
canvas.focus();

const moteur = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(moteur);

// Décor + objets cibles (multi-objets)
const { objetsCibles, objetsRegardables } = creerDecor(scene);


// Caméra unique (mobile)
const cameraMobile = creerCameraMobile(scene, canvas);
scene.activeCamera = cameraMobile;

// Auto-cadrage initial (voir la scène même si décalée)
autoCadrerCameraMobile(cameraMobile, objetsCibles, 0.7);

// État de départ (pour le bouton reset)
const etatCameraDepart = capturerEtatCamera(cameraMobile);

// Menu
initialiserInterface(scene, cameraMobile, objetsCibles, objetsRegardables, etatCameraDepart);


// Rendu
moteur.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => moteur.resize());
