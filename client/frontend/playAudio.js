const API_BASE_URL = "http://localhost:8000"; // Base URL de l'API

const songs = [ 
    { id: 1, cover: "cover.jpeg" },
    { id: 2, cover: "album1.jpg" },
    { id: 3, cover: "album2.jpg" }
];

const playPauseButton = document.getElementById('playPauseButton');
const audioPlayer = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const progressContainer = document.querySelector('.progress-bar');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const cover = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');

let currentIndex = 0;

/**
 * Formate le temps en minutes et secondes.
 * @param {number} seconds - Temps en secondes.
 * @returns {string} Temps formaté "mm:ss".
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

/**
 * Récupère les données d'une piste depuis l'API par ID.
 * @param {number} id - L'ID de la piste.
 * @returns {Promise<Object>} Les données de la piste.
 */
async function fetchTrackById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/db/${id}`, {
            method: 'GET',
        });
        // Vérifie si la requête a réussi
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération de la piste : ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Impossible de récupérer la piste.");
    }
}

/**
 * Initialise l'audio et les métadonnées.
 * @param {string} songUrl - URL de la piste audio.
 * @param {string} albumCover - URL de la couverture de l'album.
 * @param {string} songTitle - Titre de la piste.
 */
function initializeAudio(songUrl, albumCover, songTitle) {
    // Définit la source audio et met à jour les métadonnées de la piste
    audioPlayer.src = `${API_BASE_URL}/audio/${songUrl}`;
    cover.src = albumCover;
    title.textContent = songTitle;
    artist.textContent = "Unknown Artist";

    // Met à jour la durée totale une fois les métadonnées chargées
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.load();
}

/**
 * Charge une piste par son index.
 * @param {number} index - L'index de la piste.
 */
async function loadTrack(index) {
    const song = songs[index]; // Récupère les données de la piste par son index
    const trackData = await fetchTrackById(song.id); // Appelle l'API pour obtenir les détails de la piste
    if (trackData) {
        const songUrl = `output/track_${trackData.details.id}.mp3`;
        const albumCover = song.cover;
        const songTitle = trackData.details.title;

        initializeAudio(songUrl, albumCover, songTitle); // Initialise l'audio avec les données reçues
    }
}

/**
 * Gère l'action play/pause.
 */
playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; // Met à jour l'icône pour "pause"
    } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = '&#9654;'; // Met à jour l'icône pour "lecture"
    }
});

/**
 * Met à jour la barre de progression et l'affichage du temps.
 */
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`; // Met à jour la largeur de la barre de progression
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime); // Met à jour l'affichage du temps actuel
});

/**
 * Passe à la piste suivante.
 */
next.addEventListener('click', async () => {
    currentIndex = (currentIndex + 1) % songs.length; // Incrémente l'index, revient à 0 si en fin de liste
    await loadTrack(currentIndex); // Charge la piste suivante
    audioPlayer.play(); // Lecture automatique
    playPauseButton.innerHTML = '&#10074;&#10074;'; // Met à jour l'icône pour "pause"
});

/**
 * Passe à la piste précédente.
 */
previous.addEventListener('click', async () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length; // Décrémente l'index, revient au dernier si à 0
    await loadTrack(currentIndex); // Charge la piste précédente
    audioPlayer.play(); // Lecture automatique
    playPauseButton.innerHTML = '&#10074;&#10074;'; // Met à jour l'icône pour "pause"
});

/**
 * Permet de naviguer dans la piste en cliquant sur la barre de progression.
 */
progressContainer.addEventListener('click', (e) => {
    const containerWidth = progressContainer.offsetWidth; // Largeur de la barre
    const clickPosition = e.offsetX; // Position du clic
    const newTime = (clickPosition / containerWidth) * audioPlayer.duration; // Nouveau temps calculé
    audioPlayer.currentTime = newTime; // Met à jour le temps de lecture
});

/**
 * Charge la piste initiale au chargement de la page.
 */
window.addEventListener('DOMContentLoaded', async () => {
    await loadTrack(currentIndex); // Charge la première piste
});
