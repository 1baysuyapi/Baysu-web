
// KVKK Modal Logic
window.openKvkkModal = function() {
    const modal = document.getElementById('kvkkModalBackdrop');
    if (modal) modal.classList.add('active');
};
window.closeKvkkModal = function() {
    const modal = document.getElementById('kvkkModalBackdrop');
    if (modal) modal.classList.remove('active');
};
