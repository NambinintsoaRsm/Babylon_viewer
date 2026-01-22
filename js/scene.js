function creerDecor(scene) {
    // Liste des objets "cibles" pour la caméra intelligente (multi-objets)
    // On exclut volontairement le sol et la skybox.
    const objetsCibles = [];

    // SOL
    const sol = BABYLON.MeshBuilder.CreateGround(
        "sol",
        { width: 100, height: 100 },
        scene
    );
    const materiauSol = new BABYLON.StandardMaterial("materiauSol", scene);
    materiauSol.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    materiauSol.specularColor = BABYLON.Color3.Black();
    sol.material = materiauSol;

    // SKYBOX
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
    const materiauSkybox = new BABYLON.StandardMaterial("materiauSkybox", scene);
    materiauSkybox.backFaceCulling = false;
    materiauSkybox.disableLighting = true;
    materiauSkybox.emissiveColor = new BABYLON.Color3(0.6, 0.75, 0.95);
    skybox.material = materiauSkybox;

    // LUMIÈRE
    const lumiere = new BABYLON.HemisphericLight(
        "lumiere",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    lumiere.intensity = 0.9;

    // MARKERS
    objetsCibles.push(creerMarker(scene, 5, 5, new BABYLON.Color3(1, 0, 0)));
    objetsCibles.push(creerMarker(scene, -5, 5, new BABYLON.Color3(0, 1, 0)));
    objetsCibles.push(creerMarker(scene, 0, -5, new BABYLON.Color3(0, 0, 1)));

    // BÂTIMENTS
    objetsCibles.push(
        creerBatiment(scene, -10, -10, 6, 6, 8, new BABYLON.Color3(0.7, 0.7, 0.7))
    );
    objetsCibles.push(
        creerBatiment(scene, 0, -10, 6, 6, 12, new BABYLON.Color3(0.6, 0.6, 0.8))
    );
    objetsCibles.push(
        creerBatiment(scene, 10, -10, 6, 6, 10, new BABYLON.Color3(0.8, 0.6, 0.6))
    );

    // ROUTES (si tu veux que la caméra cadre la route aussi)
    objetsCibles.push(creerRoute(scene, 0, 0, 100, 6));
    objetsCibles.push(creerRoute(scene, -20, 0, 6, 100));

    // ARBRES (tronc + feuillage)
    const arbre1 = creerArbre(scene, -15, -10);
    objetsCibles.push(arbre1.tronc, arbre1.feuillage);

    const arbre2 = creerArbre(scene, 15, -10);
    objetsCibles.push(arbre2.tronc, arbre2.feuillage);

    // OBJET DÉCALÉ (exemple hors centre)
    const boiteDecalee = BABYLON.MeshBuilder.CreateBox(
        "boiteDecalee",
        { width: 3, height: 3, depth: 3 },
        scene
    );
    boiteDecalee.position.set(50, 0, 160);
    objetsCibles.push(boiteDecalee);

    // OBJETS "REGARDABLES" (3 objets placés devant/derrière/ailleurs)
    const objetsRegardables = [];

    const objetA = BABYLON.MeshBuilder.CreateBox("objetA", { size: 4 }, scene);
    objetA.position.set(500, 2, 10);     // devant à droite
    objetsCibles.push(objetA);
    objetsRegardables.push(objetA);

    const objetB = BABYLON.MeshBuilder.CreateBox("objetB", { size: 4 }, scene);
    objetB.position.set(-250, 2, -15);   // derrière à gauche
    objetsCibles.push(objetB);
    objetsRegardables.push(objetB);

    const objetC = BABYLON.MeshBuilder.CreateBox("objetC", { size: 4 }, scene);
    objetC.position.set(5, 500, 40);      // loin devant
    objetsCibles.push(objetC);
    objetsRegardables.push(objetC);


    const matA = new BABYLON.StandardMaterial("matA", scene);
    matA.diffuseColor = new BABYLON.Color3(1, 0.8, 0.2);
    objetA.material = matA;

    const matB = new BABYLON.StandardMaterial("matB", scene);
    matB.diffuseColor = new BABYLON.Color3(0.6, 0.9, 1);
    objetB.material = matB;

    const matC = new BABYLON.StandardMaterial("matC", scene);
    matC.diffuseColor = new BABYLON.Color3(0.9, 0.6, 0.9);
    objetC.material = matC;


    return { objetsCibles, objetsRegardables };
}

/* === SOUS-FONCTIONS === */

function creerMarker(scene, x, z, couleur) {
    const marker = BABYLON.MeshBuilder.CreateCylinder(
        "marker",
        { height: 2, diameter: 0.5 },
        scene
    );
    marker.position.set(x, 1, z);

    const mat = new BABYLON.StandardMaterial("markerMat", scene);
    mat.diffuseColor = couleur;
    mat.specularColor = BABYLON.Color3.Black();
    marker.material = mat;

    return marker;
}

function creerBatiment(scene, x, z, largeur, profondeur, hauteur, couleur) {
    const batiment = BABYLON.MeshBuilder.CreateBox(
        "batiment",
        { width: largeur, depth: profondeur, height: hauteur },
        scene
    );

    batiment.position.set(x, hauteur / 2, z);

    const mat = new BABYLON.StandardMaterial("batimentMat", scene);
    mat.diffuseColor = couleur;
    mat.specularColor = BABYLON.Color3.Black();
    batiment.material = mat;

    return batiment;
}

function creerRoute(scene, x, z, largeur, profondeur) {
    const route = BABYLON.MeshBuilder.CreateGround(
        "route",
        { width: largeur, height: profondeur },
        scene
    );

    route.position.set(x, 0.01, z);

    const mat = new BABYLON.StandardMaterial("routeMat", scene);
    mat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    mat.specularColor = BABYLON.Color3.Black();
    route.material = mat;

    return route;
}

function creerArbre(scene, x, z) {
    const tronc = BABYLON.MeshBuilder.CreateCylinder(
        "tronc",
        { height: 3, diameter: 0.5 },
        scene
    );
    tronc.position.set(x, 1.5, z);

    const materiauTronc = new BABYLON.StandardMaterial("materiauTronc", scene);
    materiauTronc.diffuseColor = new BABYLON.Color3(0.4, 0.25, 0.1); // ✅ ton marron
    materiauTronc.specularColor = BABYLON.Color3.Black();
    tronc.material = materiauTronc;

    const feuillage = BABYLON.MeshBuilder.CreateSphere(
        "feuillage",
        { diameter: 3 },
        scene
    );
    feuillage.position.set(x, 4, z);

    const materiauFeuillage = new BABYLON.StandardMaterial(
        "materiauFeuillage",
        scene
    );
    materiauFeuillage.diffuseColor = new BABYLON.Color3(0.2, 0.6, 0.2); // ✅ ton vert
    materiauFeuillage.specularColor = BABYLON.Color3.Black();
    feuillage.material = materiauFeuillage;

    return { tronc, feuillage };
}

