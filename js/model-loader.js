import { scene, camera } from './babylon-init.js';
import { showLoading, showError } from './ui.js';

export let currentMeshes = [];

export async function loadModel(objFile, mtlFile, textureFiles = []) {
    showLoading(true);

    currentMeshes.forEach(m => m.dispose());
    currentMeshes = [];

    
    for (let key in BABYLON.FilesInput.FilesToLoad) {
        delete BABYLON.FilesInput.FilesToLoad[key];
    }
    // pour contourner le CORS et charger les fichiers locaux
    try {
        // 1. Enregistrer l'OBJ
        BABYLON.FilesInput.FilesToLoad[objFile.name.toLowerCase()] = objFile;
        
        // 2. Enregistrer le MTL si présent
        if (mtlFile) {
            BABYLON.FilesInput.FilesToLoad[mtlFile.name.toLowerCase()] = mtlFile;
        }

        // 3. Enregistrer TOUTES les textures (PNG, JPG)
        if (textureFiles) {
            Array.from(textureFiles).forEach(file => {
                BABYLON.FilesInput.FilesToLoad[file.name.toLowerCase()] = file;
            });
        }

        // 4. Charger via le protocole "file:"
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
            '',
            'file:', 
            objFile.name,
            scene,
            undefined,
            '.obj'
        );

        currentMeshes = result.meshes.filter(m => m.name !== 'camera');

        if (currentMeshes.length) {
            // on redimensionne et centre le modèle pour pas que ça soit trop grand/petit
            const bbox = currentMeshes[0].getHierarchyBoundingVectors();
            const size = bbox.max.subtract(bbox.min);
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scaleFactor = 5 / maxDimension;
            
            currentMeshes.forEach(mesh => {
                mesh.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
            });

            const newBbox = currentMeshes[0].getHierarchyBoundingVectors();
            camera.setTarget(BABYLON.Vector3.Center(newBbox.min, newBbox.max));
            camera.radius = Math.max(size.x, size.y, size.z) * 2;
            
            document.getElementById('cameraControls').style.display = 'flex';
            document.getElementById('scaleControl').style.display = 'flex';
        }

        showLoading(false);
    } catch (err) {
        console.error('Erreur de chargement:', err);
        showError('Erreur de chargement. Vérifiez les fichiers sélectionnés.');
        showLoading(false);
    }
}

// Ajuster la taille manuellement
export function setModelScale(scaleFactor) {
    currentMeshes.forEach(mesh => {
        mesh.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);
    });
}
