import sqlite3 from 'sqlite3';

sqlite3.verbose();
const db = new sqlite3.Database('db/music1.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    cover BLOB,
    artist TEXT,
    audio BLOB,
    genre TEXT NOT NULL 
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table created or already exists.');
  }
});

db.close();