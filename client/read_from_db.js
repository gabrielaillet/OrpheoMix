const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../server/db/music2.db');

// Function to retrieve an MP3 file
function retrieveMP3(id, outputPath, outputText ) {
  db.get(
    `SELECT title, cover, artist, audio FROM tracks WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error('Error retrieving MP3 file:', err.message);
      } else if (row) {
        fs.writeFileSync(outputPath, row.audio);
        fs.writeFileSync(outputText, row.title);
        console.log(`MP3 file saved to: ${outputPath}`);
      } else {
        console.log('No track found with the given ID.');
      }
    }
  );
}

// Retrieve an MP3 file (example)
retrieveMP3(1, './output.mp3', 'text.txt');

// Close the database connection
db.close();
