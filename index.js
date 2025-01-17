
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Détermine le chemin absolu du fichier courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading the file");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
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
//app.listen(PORT, () => {
  //  console.log(`Server is running on http://localhost:${PORT}`);

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    // Serve the index page
    serveFile(res, "index.html", "text/html");
  } else if (req.url === "/css/index.css") {
    // Serve the CSS for the index page
    serveFile(res, "/css/index.css", "text/css");
  } else if (req.url === "/css/firstPage.css") {
    // Serve the CSS for the first page
    serveFile(res, "/css/firstPage.css", "text/css");
  } else if (req.url === "/css/nextPage.css") {
    // Serve the CSS for the next page
    serveFile(res, "/css/nextPage.css", "text/css");
  } else if (req.url === "/css/bootstrap.min.css") {
    // Serve the CSS for the next page
    serveFile(res, "/css/bootstrap.min.css", "text/css");

  } else if (req.url === "/firstPage.html") {

  } else if (req.url === "/artistes.html") {
    serveFile(res, "/html/artistes.html", "text/html");
  } else if (req.url === "/sons.html") {
    serveFile(res, "/html/sons.html", "text/html");
  } else if (req.url === "/playlists.html") {
    serveFile(res, "/html/playlists.html", "text/html");
  } else if (req.url === "/firstpage.html") {
    // Serve the first page
    serveFile(res, "/html/firstPage.html", "text/html");
  } else if (req.url === "/nextpage.html") {
    // Serve the next page
    serveFile(res, "/html/nextPage.html", "text/html");
  } else if (req.url === "/js/buttonGroup.js") {
    // Serve the button group JavaScript file
    serveFile(res, "js/buttonGroup.js", "application/javascript");
  } else if (req.url === "/js/bootstrap.bundle.min.js") {
    // Serve the button group JavaScript file
    serveFile(res, "/js/bootstrap.bundle.min.js", "application/javascript");

  } else if (req.url.startsWith("/assets/")) {
    // Serve assets (images, etc.)
    const ext = path.extname(req.url).toLowerCase();
    let contentType;

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      default:
        contentType = "application/octet-stream"; // Default content type
    }

    serveFile(res, req.url, contentType);

  } else if (req.url === "/js/musicPlayer.js") {
    // Serve the music player JavaScript file
    serveFile(res, "js/musicPlayer.js", "application/javascript");
  } else if (req.url === "/test.mp3") {
    // Serve the test MP3 file
    serveFile(res, "html/test.mp3", "audio/mpeg");

  } else {
    // Serve 404 for unknown routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});
// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);

});
