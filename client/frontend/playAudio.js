const songs = [ 
    { name : "test", cover : "cover.jpeg", artist : "Suna" },
    { name : "danger", cover : "album1.jpg", artist : "Internet" },
    { name : "psytrance-loop", cover : "album2.jpg", artist : "Internet2" }
]

const playPauseButton = document.getElementById('playPauseButton');
const audioPlayer = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
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


audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});

const initializeAudio = (song, album, name) => {
    audioPlayer.src = `${song}.mp3`;
    cover.src = `${album}`
    title.innerHTML = song
    artist.innerHTML = name
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

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('ended', () => {
    playPauseButton.innerHTML = '&#9654;'; 
    progressBar.style.width = '0%'; 
    currentTimeDisplay.textContent = '0:00';
});

next.addEventListener('click', () => {
    ++index 
    index = index % (songs.length)
    const song = songs[index]
    const { name, cover, artist } = song
    initializeAudio(name, cover, artist)
})
previous.addEventListener('click', () => {
    --index 
    index = index % (songs.length)
    if (index < 0) {
        index = songs.length - 1
    }
    const song = songs[index]
    const { name, cover, artist } = song
    initializeAudio(name, cover, artist)
})

window.addEventListener('DOMContentLoaded', () => {
    const song = songs[index]
    const { name, cover, artist } = song 
    initializeAudio(name, cover, artist)
});