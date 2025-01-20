// Music player functionality
const playPauseButton = document.getElementById("playPauseButton");
const audioPlayer = document.getElementById("audioPlayer");

playPauseButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.innerHTML = "&#10074;&#10074;"; // Pause icon
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = "&#9654;"; // Play icon
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  const progress = document.getElementById("progress");
  const currentTime = document.getElementById("currentTime");
  const totalTime = document.getElementById("totalTime");

  const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
  const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
  const durationMinutes = Math.floor(audioPlayer.duration / 60);
  const durationSeconds = Math.floor(audioPlayer.duration % 60);

  currentTime.textContent = `${currentMinutes}:${
    currentSeconds < 10 ? "0" : ""
  }${currentSeconds}`;
  totalTime.textContent = `${durationMinutes}:${
    durationSeconds < 10 ? "0" : ""
  }${durationSeconds}`;

  const progressPercent =
    (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progress.style.width = `${progressPercent}%`;
});
