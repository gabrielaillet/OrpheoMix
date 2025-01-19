import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Enable verbose mode for debugging SQLite
sqlite3.verbose();

// Get __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the "music1.db" database and its "tracks" table
const musicDbPath = path.join(__dirname, "db", "music1.db");
const musicDb = new sqlite3.Database(musicDbPath, (err) => {
  if (err) {
    console.error("Error opening music database:", err.message);
  } else {
    console.log("Connected to the SQLite music database.");
  }
});

musicDb.run(
  `
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    cover BLOB,
    artist TEXT,
    audio BLOB,
    genre TEXT NOT NULL
  )
`,
  (err) => {
    if (err) {
      console.error("Error creating tracks table:", err.message);
    } else {
      console.log('Table "tracks" created or already exists.');
    }
  }
);

// Close music database
musicDb.close();

// Create "users.db" for user data
const usersDbPath = path.join(__dirname, "db", "users.db");
const usersDb = new sqlite3.Database(usersDbPath, (err) => {
  if (err) {
    console.error("Error creating users database:", err.message);
  } else {
    console.log("Connected to the SQLite users database.");
  }
});

usersDb.run(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pseudo TEXT NOT NULL,
    password TEXT NOT NULL
  )
`,
  (err) => {
    if (err) {
      console.error('Error creating "users" table:', err.message);
    } else {
      console.log('Table "users" created successfully.');
    }
  }
);

// Close users database
usersDb.close();

// Create "playlistDB.sqlite" for playlists and songs
const playlistDbPath = path.join(__dirname, "db", "playlistDB.sqlite");
let playlistDb;

// Check if the database file exists
if (!fs.existsSync(playlistDbPath)) {
  playlistDb = new sqlite3.Database(playlistDbPath, (err) => {
    if (err) {
      console.error("Error creating playlist database:", err.message);
    } else {
      console.log("Playlist database created at", playlistDbPath);
    }
  });

  playlistDb.exec(
    `
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY,
      song BLOB,
      title TEXT,
      artist TEXT,
      genre TEXT,
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
      hashedPwd TEXT
    );

    CREATE TABLE IF NOT EXISTS genres (
      id INTEGER PRIMARY KEY,
      genre TEXT
    );
  `,
    (err) => {
      if (err) {
        console.error("Error creating tables for playlist database:", err.message);
      } else {
        console.log("All tables for playlist database created successfully.");
      }
    }
  );
} else {
  playlistDb = new sqlite3.Database(playlistDbPath, (err) => {
    if (err) {
      console.error("Error opening playlist database:", err.message);
    } else {
      console.log("Playlist database already exists.");
    }
  });
}

// Close playlist database
if (playlistDb) {
  playlistDb.close();
}
