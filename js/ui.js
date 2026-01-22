function initialiserInterface(scene, cameraMobile, objetsCibles, objetsRegardables, etatCameraDepart) {
    let ratioEcran = 0.7;
    let autoCadrageActif = true;

    const curseur = document.getElementById("zoomSlider");
    const valeurZoom = document.getElementById("zoomValue");
    const selectMode = document.getElementById("modeControle");
    const checkboxAuto = document.getElementById("autoCadrage");
    const boutonAuto = document.getElementById("autoBtn");
    const boutonReset = document.getElementById("resetBtn");

    const mettreAJourAffichageRatio = () => {
        if (valeurZoom) valeurZoom.textContent = Math.round(ratioEcran * 100) + "%";
    };

    const selectCible = document.getElementById("cibleRegard");
    const boutonRegarder = document.getElementById("regarderBtn");
    const checkAutoRegard = document.getElementById("autoRegard");
    const sliderDistance = document.getElementById("distanceRegard");
    const distanceValeur = document.getElementById("distanceValeur");

    let autoRegardActif = checkAutoRegard ? checkAutoRegard.checked : true;
    let seuilDistance = sliderDistance ? parseInt(sliderDistance.value, 10) : 35;

    if (distanceValeur) distanceValeur.textContent = String(seuilDistance);

    if (checkAutoRegard) {
        checkAutoRegard.onchange = () => {
            autoRegardActif = checkAutoRegard.checked;
        };
    }

    if (sliderDistance) {
        sliderDistance.oninput = () => {
            seuilDistance = parseInt(sliderDistance.value, 10);
            if (distanceValeur) distanceValeur.textContent = String(seuilDistance);
        };
    }

    // Bouton: tourner vers un objet choisi (sans bouger)
    if (boutonRegarder) {
        boutonRegarder.onclick = () => {
            const choixCible = selectCible ? selectCible.value : "proche";

            let cible = null;

            if (choixCible === "proche") {
                const res = trouverObjetLePlusProche(cameraMobile, objetsRegardables);
                cible = res ? res.obj : null;
            } else {
                cible = (objetsRegardables || []).find(o => o && o.name === choixCible) || null;
            }

            if (cible) orienterCameraVersMesh(cameraMobile, cible);
        };
    }

    // Auto-regard: uniquement orientation quand on passe sous la distance seuil
    if (objetsRegardables && objetsRegardables.length > 0) {
        activerAutoRegardProximite(
            scene,
            cameraMobile,
            objetsRegardables,
            () => autoRegardActif,
            () => seuilDistance
        );
    }

    if (curseur) ratioEcran = (parseInt(curseur.value, 10) || 70) / 100;
    mettreAJourAffichageRatio();

    if (checkboxAuto) {
        autoCadrageActif = checkboxAuto.checked;
        checkboxAuto.onchange = () => (autoCadrageActif = checkboxAuto.checked);
    }

    if (curseur) {
        curseur.oninput = () => {
            ratioEcran = (parseInt(curseur.value, 10) || 70) / 100;
            mettreAJourAffichageRatio();
        };
    }

    if (boutonAuto) {
        boutonAuto.onclick = () => {
            autoCadrerCameraMobile(cameraMobile, objetsCibles, ratioEcran);
        };
    }

    if (boutonReset) {
        boutonReset.onclick = () => {
            restaurerEtatCamera(cameraMobile, etatCameraDepart);
        };
    }

    const appliquerMode = () => {
        const mode = selectMode ? selectMode.value : "souris";

        const canvas = scene.getEngine().getRenderingCanvas();
        if (canvas) {
            canvas.tabIndex = 1;
            canvas.focus();
        }

        if (mode === "clavier") activerModeClavier(cameraMobile, canvas);
        else activerModeSouris(cameraMobile, canvas);
    };

    if (selectMode) selectMode.onchange = appliquerMode;

    appliquerMode();
}
