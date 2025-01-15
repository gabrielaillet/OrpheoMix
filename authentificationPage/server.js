const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Chemin vers la base de données
const dbPath = path.join(__dirname, 'db', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier "page"
app.use(express.static(path.join(__dirname, 'page')));

// Serve static files from the root directory (for index.html)
app.use(express.static(path.join(__dirname, '')));

// Route d'inscription
app.post('/signup', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).send('Pseudo and password are required.');
    }

    // Vérifier si l'utilisateur existe déjà
    const checkQuery = `SELECT * FROM users WHERE pseudo = ? AND password = ?`;
    db.get(checkQuery, [pseudo, password], (err, row) => {
        if (err) {
            console.error('Error checking user existence:', err.message);
            return res.status(500).send('Error checking user existence.');
        }

        if (row) {
            // Si l'utilisateur existe déjà
            return res.status(400).send('You already have an account, you can directly log in.');
        }

        // Si l'utilisateur n'existe pas, on l'insère
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

// Route de connexion
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
            return res.status(401).send('Invalid pseudo or password. Try again or sign up if you do not have an account');
        }

        // Si l'authentification est réussie, redirige vers la page index.html
        res.redirect('/index.html');
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

