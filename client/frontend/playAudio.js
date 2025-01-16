const songs = [
    { id: 1, name: "test", cover: "cover.jpeg", artist: "Suna" },
    { id: 2, name: "danger", cover: "album1.jpg", artist: "Internet" },
    { id: 3, name: "psytrance-loop", cover: "album2.jpg", artist: "Internet2" }
];


const playPauseButton = document.getElementById('playPauseButton');
const audioPlayer = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const progressContainer = document.querySelector('.progress-bar');
const next = document.getElementById('next');
const previous = document.getElementById('previous')
const cover = document.getElementById('cover');
const title = document.getElementById('title')
const artist = document.getElementById('artist')

var index = 0
for (let i = 0; i < songs.length; i++ ) {
    if (title == songs[i].name) {
        index = i
        break
    } 
}
console.log(index)

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

/*
const changerRoute = (name) => {
    const url = `/song/${name}`;
    history.pushState({ name }, '', url);
};
*/

audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});

const initializeAudio = (song, album, name) => {
    const n = index + 1;
    audioPlayer.src = `http://localhost:8000/audio/${n}`; // `song` ici représente l'ID

    cover.src = `http://localhost:8000/cover/${n}`
    title.innerHTML = song
    artist.innerHTML = name
    //changerRoute(name);
    audioPlayer.addEventListener('loadedmetadata', () => {
      totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.load();
};

playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; 
    } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = '&#9654;'; 
    }
});

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.name) {
        const song = songs.find((s) => s.name === event.state.name);
        if (song) {
            index = songs.indexOf(song);
            const { name, cover, artist } = song;
            initializeAudio(name, cover, artist);
        }
    }
});


audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('ended', () => {
    playPauseButton.innerHTML = '&#9654;'; 
    progressBar.style.width = '0%'; 
    currentTimeDisplay.textContent = '0:00';
    ++index 
    index = index % (songs.length)
    const song = songs[index]
    const { name, cover, artist } = song
    initializeAudio(name, cover, artist)
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; 
    }
});

next.addEventListener('click', () => {
    playPauseButton.innerHTML = '&#9654;'; 
    progressBar.style.width = '0%'; 
    currentTimeDisplay.textContent = '0:00';
    
    ++index 
    index = index % (songs.length)
    const song = songs[index]
    const { name, cover, artist } = song
    initializeAudio(name, cover, artist)
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; 
    }
})
previous.addEventListener('click', () => {
    playPauseButton.innerHTML = '&#9654;'; 
    progressBar.style.width = '0%'; 
    currentTimeDisplay.textContent = '0:00';
    --index 
    index = index % (songs.length)
    if (index < 0) {
        index = songs.length - 1
    }
    const song = songs[index]
    const { name, cover, artist } = song
    initializeAudio(name, cover, artist)
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '&#10074;&#10074;'; 
    }
})

progressContainer.addEventListener('click', (e) => {
    const containerLargeur = progressContainer.offsetWidth;
    const clickPosition = e.offsetX; 
    const nouveauTime = (clickPosition / containerLargeur) * audioPlayer.duration;
    audioPlayer.currentTime = nouveauTime; 
});

window.addEventListener('DOMContentLoaded', () => {
    const song = songs[index]
    const { name, cover, artist } = song 
    initializeAudio(name, cover, artist)
});