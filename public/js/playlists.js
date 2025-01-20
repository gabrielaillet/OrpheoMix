const API_BASE_URL = 'http://localhost:3000'; 

async function addToPlaylist(playlistId, songId) {
    try {
      const response = await fetch(`${API_BASE_URL}/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
      });
  
      if (response.ok) {
        alert('Song added to playlist');
      } else {
        throw new Error('Error adding song to playlist');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding song to playlist');
    }
  }