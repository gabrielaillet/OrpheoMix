import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create unified database
const playlistDbPath = path.join(__dirname, "db", "playlistDB.sqlite");
let playlistDb;

if (!fs.existsSync(playlistDbPath)) {
  playlistDb = new sqlite3.Database(playlistDbPath, (err) => {
    if (err) {
      console.error("Error creating unified database:", err.message);
    } else {
      console.log("Unified database created at", playlistDbPath);
    }
  });

  playlistDb.exec(
    `
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT,
      genre TEXT NOT NULL,
      audio BLOB,
      cover BLOB,
      albumId INTEGER,
      duration INTEGER,
      FOREIGN KEY(albumId) REFERENCES albums(id)
    );

    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY,
      cover BLOB,
      title TEXT,
      artist TEXT
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY,
      title TEXT,
      ownerId INTEGER,
      FOREIGN KEY(ownerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS playlist_songs (
      playlistId INTEGER,
      songId INTEGER,
      FOREIGN KEY(playlistId) REFERENCES playlists(id),
      FOREIGN KEY(songId) REFERENCES songs(id),
      PRIMARY KEY(playlistId, songId)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      pseudo TEXT NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    );
    `,
    (err) => {
      if (err) {
        console.error("Error creating tables:", err.message);
      } else {
        console.log("All tables created successfully.");
      }
    }
  );
} else {
  playlistDb = new sqlite3.Database(playlistDbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Database already exists.");
    }
  });
}

// Close database connection
if (playlistDb) {
  playlistDb.close();
}
