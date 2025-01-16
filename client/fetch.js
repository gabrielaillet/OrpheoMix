const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../server/db/music1.db');

// Function to insert an MP3 file
function insertMP3(title, coverPath, artist, filePath) {
  const audioData = fs.readFileSync(filePath); // Lire le fichier MP3 comme données binaires
  const coverData = fs.readFileSync(coverPath); // Lire l'image comme données binaires

  db.run(
    `INSERT INTO tracks (title, cover, artist, audio) VALUES (?, ?, ?, ?)`,
    [title, coverData, artist, audioData],
    function (err) {
      if (err) {
        console.error('Error inserting MP3 file:', err.message);
      } else {
        console.log(`MP3 file inserted with ID: ${this.lastID}`);
      }
    }
  );
}



// Insert an MP3 file (example)

const songs = [ 
  { name : "test", cover : "frontend/cover.jpeg", artist : "Suna" , filePath : "frontend/test.mp3" },
  { name : "danger", cover : "frontend/album1.jpg", artist : "Internet", filePath : "frontend/danger.mp3" },
  { name : "psytrance-loop", cover : "frontend/album2.jpg", artist : "Internet2", filePath : "frontend/psytrance-loop.mp3"}
]

for (let song of songs) {
  insertMP3(song.name, song.cover, song.artist, song.filePath);
}




// Close the database connection
db.close();
