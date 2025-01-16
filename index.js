const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Connecting to the database 
const dbPath = path.join(__dirname, 'authentificationPage', 'db', 'users.db')
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Middleware to parse the JSON files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to serve the files 
function serveFile(res, fileName, contentType) {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error loading file: ${filePath}`, err);
            res.status(500).send('Error loading the file');
        } else {
            res.setHeader('Content-Type', contentType);
            res.send(data);
        }
    });
}

// Serve the static files of the authentification page
app.use(express.static(path.join(__dirname, 'authentificationPage', 'page')));

// Serve index.html
app.get('/index.html', (req, res) => {
    serveFile(res, 'index.html', 'text/html');
});
app.get('/index.css', (req, res) => {
    serveFile(res, 'index.css', 'text/css');
});
// Routes for the 3 pages 
app.get('/firstpage.html', (req, res) => {
    serveFile(res, 'firstPage/firstPage.html', 'text/html');
});
app.get('/firstPage.css', (req, res) => {
    serveFile(res, 'firstPage/firstPage.css', 'text/css');
});
app.get('/nextpage.html', (req, res) => {
    serveFile(res, 'nextPage/nextPage.html', 'text/html');
});
app.get('/nextPage.css', (req, res) => {
    serveFile(res, 'nextPage/nextPage.css', 'text/css');
});

// Route for sign up 
app.post('/signup', (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).send('Pseudo and password are required.');
    }

    // Check if the user already exists
    const checkQuery = `SELECT * FROM users WHERE pseudo = ? `;
    db.get(checkQuery, [pseudo], (err, row) => {
        if (err) {
            console.error('Error checking user existence:', err.message);
            return res.status(500).send('Error checking user existence.');
        }

        if (row) {
            // If the user already exists
            return res.status(400).send('This pseudo is already taken, use a different one please.');
        }

        // If the user does not exist, insert the credentialsinto the database 
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

// Log in route
app.post('/login', (req, res) => {
    const { pseudo, password } = req.body;
    //const { password } = req.body;

    if (!pseudo || !password) {
        return res.status(400).send('pseudo and password are required.');
    }

    const query = `SELECT * FROM users WHERE pseudo = ? AND password = ?`;
    db.get(query, [pseudo, password], (err, row) => {
        if (err) {
            console.error('Error querying database:', err.message);
            return res.status(500).send('Error logging in.');
        }

        if (!row) {
            return res.status(401).send('Invalid password or pseudo. Try again or sign up if you do not have an account');
        }

        console.log("User authentificated, redirecting to index.html");
        // if authentification succeeded, redirect to index page
        res.redirect('http://localhost:3000/index.html');
        
    });
});

// Starting server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
