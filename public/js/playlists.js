export function initializePlaylists() {
  fetch("http://localhost:8000/playlists/${userId}/playlists")
    .then((response) => response.json())
    .then((playlists) => {
      console.log("Playlists:", playlists);
      const playlistsList = document.getElementById("playlistsList");
      playlists.forEach((playlist) => {
        const li = document.createElement("li");
        li.textContent = playlist.title;
        li.onclick = () => loadSongs(playlist.id);
        playlistsList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching playlists:", error));
}

export function loadSongs(playlistId) {
  fetch(`http://localhost:8000/playlists/${playlistId}/songs`)
    .then((response) => response.json())
    .then((songs) => {
      const songsList = document.getElementById("songsList");
      songsList.innerHTML = ""; // Clear existing songs
      songs.forEach((song) => {
        const li = document.createElement("li");
        li.textContent = `${song.title} - ${song.artist}`;
        li.onclick = () => playSong(song.id);
        songsList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching songs:", error));
}

export function playSong(songId) {
  console.log("Playing song with ID:", songId);
  // Add your logic to play the song
}
