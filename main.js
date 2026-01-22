const canvas = document.getElementById("renderCanvas");

// 1️⃣ Engine = moteur Babylon
const engine = new BABYLON.Engine(canvas, true);

// 2️⃣ Scene = le monde 3D
const scene = new BABYLON.Scene(engine);

// 3️⃣ Caméra (simple)
const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,   // alpha (rotation horizontale)
    Math.PI / 3,   // beta (rotation verticale)
    10,            // rayon (distance)
    BABYLON.Vector3.Zero(),
    scene
);

// Permet de bouger la caméra à la souris
camera.attachControl(canvas, true);

// 4️⃣ Lumière
const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
);

// 5️⃣ Un objet (cube)
const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
box.position.set(10,0,0);const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 50,
    height: 50
}, scene);

const groundMaterial = new BABYLON.StandardMaterial("groundMat", scene);
groundMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.8, 0.4);

ground.material = groundMaterial;



// 6️⃣ Boucle de rendu
engine.runRenderLoop(() => {
    scene.render();
});

// 7️⃣ Resize automatique
window.addEventListener("resize", () => {
    engine.resize();
});
