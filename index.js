import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Connexion à la base de données
const dbPath = path.join(__dirname, 'authentificationPage', 'db', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Middleware pour parser JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'authentificationPage', 'page')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

// Route POST pour le sign-up
app.post('/signup', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).send('Pseudo and password are required.');
    }

    const checkQuery = `SELECT * FROM users WHERE pseudo = ?`;
    db.get(checkQuery, [pseudo], (err, row) => {
        if (err) {
            console.error('Error checking user existence:', err.message);
            return res.status(500).send('Error checking user existence.');
        }

        if (row) {
            return res.status(400).send('This pseudo is already taken.');
        }

        const insertQuery = `INSERT INTO users (pseudo, password) VALUES (?, ?)`;
        db.run(insertQuery, [pseudo, password], function (err) {
            if (err) {
                console.error('Error inserting user:', err.message);
                return res.status(500).send('Error registering user.');
            }

            res.status(201).send({ message: 'User registered successfully', id: this.lastID });
        });
    });
});

// Route POST pour le login
app.post('/login', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).send('Pseudo and password are required.');
    }

    const query = `SELECT * FROM users WHERE pseudo = ? AND password = ?`;
    db.get(query, [pseudo, password], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send('Error logging in.');
        }

        if (!row) {
            return res.status(401).send('Invalid pseudo or password.');
        }

        res.redirect('/index.html');
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
