import { initBabylon, switchCamera, resetCamera } from './babylon-init.js';
import { initEvents } from './events.js';
import { setModelScale } from './model-loader.js';

// Rendre les fonctions accessibles globalement pour les boutons onclick
window.switchCamera = switchCamera;
window.resetCamera = resetCamera;
window.changeScale = changeScale;

function changeScale(value) {
    const scaleValue = parseFloat(value);
    document.getElementById('scaleValue').textContent = scaleValue.toFixed(1);
    setModelScale(scaleValue);
}

document.addEventListener('DOMContentLoaded', () => {
    initBabylon();
    initEvents();
});
