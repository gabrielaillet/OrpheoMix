const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../server/db/music1.db');

// Function to insert an MP3 file
function insertMP3(title, cover, artist, genre, filePath) {
  const audioData = fs.readFileSync(filePath);

  db.run(
    `INSERT INTO tracks (title, cover, artist, genre, audio) VALUES (?, ?, ?, ?, ?)`,
    [title, cover, artist, genre, audioData],
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
  { name : "test", cover : "cover.jpeg", artist : "Suna" , genre : "AI Music" ,  filePath : "frontend/test.mp3" },
  { name : "danger", cover : "album1.jpg", artist : "Internet", genre : "POP" , filePath : "frontend/danger.mp3" },
  { name : "psytrance-loop", cover : "album2.jpg", artist : "Internet2", genre : "Classical" , filePath : "frontend/psytrance-loop.mp3"},
]

for (let song of songs) {
  insertMP3(song.name, song.cover, song.artist, song.genre, song.filePath);
}




// Close the database connection
db.close();
