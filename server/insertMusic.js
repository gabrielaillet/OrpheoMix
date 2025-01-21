// insertMusic.js
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the unified database
const db = new sqlite3.Database(
  path.join(__dirname, "db", "playlistDB.sqlite")
);

/**
 * Inserts a song into the database
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {string} genre - Song genre
 * @param {string} audioPath - Path to the audio file
 * @param {string} coverPath - Path to the cover image file
 * @param {number} duration - Song duration in seconds
 * @returns {Promise} Promise that resolves with the inserted song ID
 */
function insertSong(title, artist, genre, audioPath, coverPath, duration) {
  return new Promise((resolve, reject) => {
    // Read the audio and cover files
    let audioData = null;
    let coverData = null;

    try {
      audioData = fs.readFileSync(audioPath);
      if (coverPath) {
        coverData = fs.readFileSync(coverPath);
      }
    } catch (error) {
      reject(new Error(`Error reading files: ${error.message}`));
      return;
    }

    // Insert the song into the database
    const query = `
            INSERT INTO songs (title, artist, genre, audio, cover, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

    db.run(
      query,
      [title, artist, genre, audioData, coverData, duration],
      function (err) {
        if (err) {
          reject(new Error(`Error inserting song: ${err.message}`));
        } else {
          resolve(this.lastID);
          console.log(
            `Song "${title}" inserted successfully with ID: ${this.lastID}`
          );
        }
      }
    );
  });
}

// Example usage:
async function insertSampleSong() {
  try {
    const songId = await insertSong(
      "Sample Song",
      "Sample Artist",
      "Rock",
      "path/to/audio.mp3",
      "path/to/cover.jpg",
      180 // duration in seconds
    );
    console.log(`Song inserted with ID: ${songId}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Close database connection when done
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
  });
}

export { insertSong, closeDatabase };
