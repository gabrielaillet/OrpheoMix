const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('music.db');

// Function to insert an MP3 file
function insertMP3(title, artist, filePath) {
  const audioData = fs.readFileSync(filePath); // Read the MP3 file as binary data

  db.run(
    `INSERT INTO tracks (title, artist, audio) VALUES (?, ?, ?)`,
    [title, artist, audioData],
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
insertMP3('Sample Track', 'Sample Artist', './sample.mp3');

// Close the database connection
db.close();
