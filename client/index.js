// Vérifie si le Service Worker est pris en charge par le navigateur
if ('serviceWorker' in navigator) {
    // Enregistre le service worker
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
        .then((registration) => {
            // Si l'enregistrement est réussi, on affiche un message
            console.log('Service Worker enregistré avec le scope:', registration.scope);
        })
        .catch((error) => {
            // Si l'enregistrement échoue, on affiche l'erreur
            console.error('L\'enregistrement du Service Worker a échoué:', error);
        });
} else {
    // Si les Service Workers ne sont pas supportés par le navigateur
    console.log('Les Service Workers ne sont pas supportés par ce navigateur.');
}
