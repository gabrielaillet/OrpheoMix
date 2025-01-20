import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, "playlistDB.sqlite");
let database;

if (!fs.existsSync(dbPath)) {
  database = new Database(dbPath);

  database.exec(`
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
  `);

  // // Insert dummy data
  // database.exec(`
  //   INSERT INTO users (username, hashedPwd) VALUES ('user1', 'hashedpassword1');
  //   INSERT INTO users (username, hashedPwd) VALUES ('user2', 'hashedpassword2');

  //   INSERT INTO albums (title, artist) VALUES ('Album 1', 'Artist 1');
  //   INSERT INTO albums (title, artist) VALUES ('Album 2', 'Artist 2');

  //   INSERT INTO songs (song, title, artist, albumId, duration) VALUES (NULL, 'Song 1', 'Artist 1', 1, 300);
  //   INSERT INTO songs (song, title, artist, albumId, duration) VALUES (NULL, 'Song 2', 'Artist 2', 2, 200);

  //   INSERT INTO playlists (title, ownerId) VALUES ('Playlist 1', 1);
  //   INSERT INTO playlists (title, ownerId) VALUES ('Playlist 2', 2);

  //   INSERT INTO playlist_songs (playlistId, songId) VALUES (1, 1);
  //   INSERT INTO playlist_songs (playlistId, songId) VALUES (1, 2);
  //   INSERT INTO playlist_songs (playlistId, songId) VALUES (2, 1);
  // `);
} else {
  database = new Database(dbPath);
  console.log("Database already exists.");
}

export default database;
