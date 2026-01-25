export function showLoading(visible) {
    document.getElementById('loadingOverlay').style.display = visible ? 'flex' : 'none';
}

export function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorOverlay').style.display = 'flex';
}

export function resetUI() {
    document.getElementById('errorOverlay').style.display = 'none';
}
