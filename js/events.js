import { loadModel } from './model-loader.js';

//classe pour les écouteurs en fonctions de ce que l'utilisateur fait
export function initEvents() {
    const objInput = document.getElementById('objInput');
    const mtlInput = document.getElementById('mtlInput');
    const texInput = document.getElementById('texInput');

    const triggerLoad = () => {
        const obj = objInput.files[0];
        const mtl = mtlInput.files[0];
        const textures = texInput.files;
        
        if (obj) loadModel(obj, mtl, textures);
    };

    objInput.addEventListener('change', (e) => {
        document.getElementById('objFileName').textContent = e.target.files[0]?.name || "Sélectionner OBJ";
        triggerLoad();
    });

    mtlInput.addEventListener('change', (e) => {
        document.getElementById('mtlFileName').textContent = e.target.files[0]?.name || "Sélectionner MTL";
        triggerLoad();
    });

    texInput.addEventListener('change', (e) => {
        const count = e.target.files.length;
        document.getElementById('texFileName').textContent = count > 0 ? `${count} image(s)` : "Ajouter des images";
        triggerLoad();
    });
}