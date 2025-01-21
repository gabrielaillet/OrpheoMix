let songs;

async function fetchSongs() {
  try {
    const response = await fetch('http://localhost:8000/songs');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    songs = await response.json();
  } catch (error) {
    console.error('There was a problem fetching the songs:', error);
  }
}

async function initializeApp() {
  await fetchSongs();

  if (!songs || songs.length === 0) {
    console.error('No songs found!');
    return;
  }

  let index = 0;

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

  for (let i = 0; i < songs.length; i++) {
    if (title.textContent === songs[i].name) {
      index = i;
      break;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  const initializeAudio = (song, musician) => {
    console.log('ici?')
    const n = index + 1;
    audioPlayer.src = `http://localhost:8000/audio/${n}`;
   
    cover.src = `http://localhost:8000/cover/${n}`;
    title.innerHTML = song;
    artist.innerHTML = musician;
    audioPlayer.addEventListener('loadedmetadata', () => {
      totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.load();

  };

  playPauseButton.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause icon
    } else {
      audioPlayer.pause();
      playPauseButton.innerHTML = '&#9654;'; // Play icon
    }
  });

  audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
  });

  audioPlayer.addEventListener('ended', () => {
    playPauseButton.innerHTML = '&#9654;'; // Play icon
    progressBar.style.width = '0%';
    currentTimeDisplay.textContent = '0:00';
    index = (index + 1) % songs.length;
    const song = songs[index];
    const { name, artist: songArtist } = song;
    initializeAudio(name, songArtist);
    audioPlayer.play();
    playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause icon
  });

  next.addEventListener('click', () => {
    index = (index + 1) % songs.length;
    const song = songs[index];
    const { title: name, artist: songArtist } = song;
    initializeAudio(name, songArtist);
    audioPlayer.play();
    playPauseButton.innerHTML = '&#10074;&#10074;';
  });

  previous.addEventListener('click', () => {
    index = (index - 1 + songs.length) % songs.length;
    const song = songs[index];
    const { title: name, artist: songArtist } = song;
    initializeAudio(name, songArtist);
    audioPlayer.play();
    playPauseButton.innerHTML = '&#10074;&#10074;';
  });

  progressContainer.addEventListener('click', (e) => {
    const containerWidth = progressContainer.offsetWidth;
    const clickPosition = e.offsetX;
    const newTime = (clickPosition / containerWidth) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  });

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.name) {
      const song = songs.find((s) => s.name === event.state.name);
      if (song) {
        index = songs.indexOf(song);
        const { name, artist: songArtist } = song;
        initializeAudio(name, songArtist);
      }
    }
  });

  const firstSong = songs[index];
  const { title: name, artist: firstArtist } = firstSong;
  initializeAudio(name, firstArtist);
}

// Start the application when the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});
