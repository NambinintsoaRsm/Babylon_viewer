function obtenirBoiteEnglobante(objets) {
    const meshes = (objets || []).filter(
        (m) => m && !m.isDisposed() && m.getBoundingInfo
    );

    if (meshes.length === 0) {
        return {
            min: new BABYLON.Vector3(0, 0, 0),
            max: new BABYLON.Vector3(0, 0, 0),
            centre: new BABYLON.Vector3(0, 0, 0),
            taille: new BABYLON.Vector3(0, 0, 0),
            tailleMax: 0,
        };
    }

    let min = new BABYLON.Vector3(
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY
    );
    let max = new BABYLON.Vector3(
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY
    );

    for (const mesh of meshes) {
        const boite = mesh.getBoundingInfo().boundingBox;
        min = BABYLON.Vector3.Minimize(min, boite.minimumWorld);
        max = BABYLON.Vector3.Maximize(max, boite.maximumWorld);
    }

    const centre = min.add(max).scale(0.5);
    const taille = max.subtract(min);
    const tailleMax = Math.max(taille.x, taille.y, taille.z);

    return { min, max, centre, taille, tailleMax };
}

function autoCadrerCameraMobile(camera, objets, ratioEcran = 0.7) {
    const { centre, tailleMax } = obtenirBoiteEnglobante(objets);
    if (!camera || !isFinite(tailleMax) || tailleMax <= 0) return;

    const fov = camera.fov;
    const distance = (tailleMax / 2) / Math.tan(fov / 2);

    const hauteur = tailleMax * 0.6;
    const recul = distance / ratioEcran;

    camera.position = centre.add(new BABYLON.Vector3(0, hauteur, -recul));
    camera.setTarget(centre);
}

function capturerEtatCamera(camera) {
    return {
        position: camera.position.clone(),
        rotation: camera.rotation
            ? camera.rotation.clone()
            : new BABYLON.Vector3(0, 0, 0),
    };
}

function restaurerEtatCamera(camera, etat) {
    if (!camera || !etat) return;
    camera.position.copyFrom(etat.position);
    if (camera.rotation) camera.rotation.copyFrom(etat.rotation);
}

function obtenirCentreObjet(mesh) {
    const boite = mesh.getBoundingInfo().boundingBox;
    return boite.minimumWorld.add(boite.maximumWorld).scale(0.5);
}

function orienterCameraVersMesh(camera, mesh) {
    if (!camera || !mesh) return;
    const centre = obtenirCentreObjet(mesh);
    camera.setTarget(centre); // ✅ oriente sans déplacer
}

function trouverObjetLePlusProche(camera, objets) {
    if (!camera || !objets || objets.length === 0) return null;

    let meilleur = null;
    let meilleureDistance = Number.POSITIVE_INFINITY;

    for (const obj of objets) {
        if (!obj || obj.isDisposed()) continue;
        const centre = obtenirCentreObjet(obj);
        const d = BABYLON.Vector3.Distance(camera.position, centre);
        if (d < meilleureDistance) {
            meilleureDistance = d;
            meilleur = obj;
        }
    }
    return { obj: meilleur, distance: meilleureDistance };
}

/**
 * Active un auto-regard "léger":
 * - ne déplace pas la caméra
 * - oriente vers l'objet le plus proche quand on est à distance <= seuil
 * - avec un petit cooldown pour ne pas "se battre" avec l'utilisateur
 */
function activerAutoRegardProximite(scene, camera, objetsRegardables, getActif, getSeuil) {
    let dernierLookMs = 0;

    return scene.onBeforeRenderObservable.add(() => {
        if (!getActif()) return;

        const seuil = getSeuil();
        const maintenant = performance.now();

        // throttle/cooldown
        if (maintenant - dernierLookMs < 400) return;

        const res = trouverObjetLePlusProche(camera, objetsRegardables);
        if (!res || !res.obj) return;

        if (res.distance <= seuil) {
            orienterCameraVersMesh(camera, res.obj);
            dernierLookMs = maintenant;
        }
    });
}
