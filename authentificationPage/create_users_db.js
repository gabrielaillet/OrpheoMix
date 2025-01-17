const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// path to the database 
const dbPath = path.join(__dirname, 'db', 'users.db');

// Creating the database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error creating database:', err.message);
    } else {
        console.log('Database created at', dbPath);

        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pseudo TEXT NOT NULL,
                password TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Table "users" created successfully.');
            }
        });
    }
});
