import sqlite3 from "sqlite3";
import express from "express";
import cors from "cors";

sqlite3.verbose();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); // Parse JSON requests

const db = new sqlite3.Database("db/music1.db", (err) => {
  if (err) {
    console.error("Error creating database:", err.message);
  } else {
    console.log("COnnected to the database", "db/music1.db");
  }
});

// Function to retrieve all tracks from the database
function retrieveAll(callback) {
  db.all(`SELECT * FROM tracks`, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function retrieveText(callback) {
  db.all(`SELECT id, title, artist FROM tracks`, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

function retrieveByGenre(genre, callback) {
  db.all(
    `SELECT id, title, artist FROM tracks WHERE genre = ?`,
    [genre],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving tracks:", err.message);
        callback(err, null);
      } else if (rows && rows.length > 0) {
        callback(null, rows);
      } else {
        console.log("No tracks found for the given genre.");
        callback(null, []);
      }
    }
  );
}

function retrieveById(id, callback) {
  db.get(
    `SELECT id, title, audio FROM tracks WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error retrieving track:", err.message);
        callback(err, null); // Passe l'erreur au rappel
      } else if (row) {
        callback(null, row); // Passe les données au rappel
      } else {
        console.log("No track found with the given ID.");
        callback(null, null); // Indique qu'aucune piste n'a été trouvée
      }
    }
  );
}

app.get("/", (req, res) => {
  res.send("Hello world !!");
});

app.get("/db", (req, res) => {
  retrieveAll((err, data) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.json(data);
    }
  });
});

app.get("/songs", (req, res) => {
  retrieveText((err, data) => {
    if (err) {
      res.status(500).send("Error retrieving data");
    } else {
      res.json(data);
    }
  });
});

//   ici pour récupérer les ids
app.get("/db/:id", (req, res) => {
  const trackId = req.params.id; // Récupère l'ID de l'URL
  const outputPath = `output/track_${trackId}.mp3`; // Chemin pour enregistrer le fichier audio
  const outputText = `output/track_${trackId}.txt`; // Chemin pour enregistrer le titre

  retrieveById(trackId, (err, row) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération de la piste.");
    } else if (!row) {
      res.status(404).send("Aucune piste trouvée avec cet ID.");
    } else {
      res.json({
        message: "Fichier MP3 et titre enregistrés avec succès.",
        details: {
          id: row.id,
          title: row.title,
        },
      });
    }
  });
});

// Endpoint pour récupérer les musiques par genre
app.get("/music/:genre", (req, res) => {
  const genre = req.params.genre; // Récupère le genre depuis l'URL

  retrieveByGenre(genre, (err, tracks) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des musiques.");
    } else if (!tracks) {
      res.status(404).send(`Aucune musique trouvée pour le genre ${genre}.`);
    } else {
      res.json(tracks);
    }
  });
});

app.get("/audio/:trackId", (req, res) => {
  const trackId = req.params.trackId; // Récupère l'ID de la piste audio

  // Récupérer le fichier audio BLOB depuis la base de données
  db.get("SELECT audio FROM tracks WHERE id = ?", [trackId], (err, row) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération du fichier audio.");
      console.error(err);
    } else if (!row) {
      res.status(404).send("Aucune piste trouvée avec cet ID.");
    } else {
      // Envoie le fichier BLOB au client avec le bon type MIME
      res.setHeader("Content-Type", "audio/mpeg"); // Type MIME pour les fichiers MP3
      res.send(row.audio); // Envoie le BLOB du fichier MP3
    }
  });
});

app.get("/cover/:trackId", (req, res) => {
  const trackId = req.params.trackId; // Récupère l'ID de la piste

  // Récupérer le fichier image BLOB depuis la base de données
  db.get("SELECT cover FROM tracks WHERE id = ?", [trackId], (err, row) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération de l'image.");
      console.error(err);
    } else if (!row) {
      res.status(404).send("Aucune piste trouvée avec cet ID.");
    } else {
      // Envoie le fichier BLOB au client avec le bon type MIME
      res.setHeader("Content-Type", "image/jpg"); // Type MIME pour une image JPEG ou JPG
      res.send(row.cover); // Envoie le BLOB de l'image
    }
  });
});

//authentification
const dbAuthentificaiton = new sqlite3.Database("db/users.db", (err) => {
  if (err) {
    console.error("Error creating database:", err.message);
  } else {
    console.log("COnnected to the database", "db/users.db");
  }
});

// Route for sign up
app.post("/signup", (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).send("Pseudo and password are required.");
  }

  // Check if the user already exists
  const checkQuery = `SELECT * FROM users WHERE pseudo = ? `;
  dbAuthentificaiton.get(checkQuery, [pseudo], (err, row) => {
    if (err) {
      console.error("Error checking user existence:", err.message);
      return res.status(500).send("Error checking user existence.");
    }

    if (row) {
      // If the user already exists
      return res
        .status(400)
        .send("This pseudo is already taken, use a different one please.");
    }

    // If the user does not exist, insert the credentialsinto the database
    const insertQuery = `INSERT INTO users (pseudo, password) VALUES (?, ?)`;
    dbAuthentificaiton.run(insertQuery, [pseudo, password], function (err) {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.status(500).send("Error registering user.");
      }

      res
        .status(201)
        .send({ message: "User registered successfully", id: this.lastID });
    });
  });
});

// Log in route
app.post("/login", (req, res) => {
  const { pseudo, password } = req.body;
  //const { password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).send("pseudo and password are required.");
  }

  const query = `SELECT id, pseudo, password FROM users WHERE pseudo = ? AND password = ?`;
  dbAuthentificaiton.get(query, [pseudo, password], (err, row) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).send("Error logging in.");
    }

    if (!row) {
      return res
        .status(401)
        .send(
          "Invalid password or pseudo. Try again or sign up if you do not have an account"
        );
    }

    console.log("User authentificated, redirecting to index.html");
    // if authentification succeeded, redirect to index page
    res.status(200).json({ message: "Login successful", id: row.id });
  });
});

// First, add a new database connection for artists
const dbArtists = new sqlite3.Database("db/artists.db", (err) => {
  if (err) {
    console.error("Error connecting to artists database:", err.message);
  } else {
    console.log("Connected to the artists database");
  }
});

// Updated function to get all artists
function retrieveAllArtists(callback) {
  dbArtists.all(
    `SELECT id, name, genre as primaryGenre, 
            (SELECT COUNT(*) FROM artists) as totalArtists
     FROM artists
     ORDER BY name`,
    (err, rows) => {
      if (err) {
        console.error(err.message);
        callback(err, null);
      } else {
        callback(null, rows);
      }
    }
  );
}

// Updated function to get artist details
function retrieveArtistDetails(artistName, callback) {
  const decodedName = decodeURIComponent(artistName);

  dbArtists.get(
    `SELECT *,
            (SELECT COUNT(*) FROM json_each(popularSongs)) as songCount
     FROM artists
     WHERE name = ?`,
    [decodedName],
    (err, artist) => {
      if (err) {
        console.error(err.message);
        callback(err, null);
      } else if (artist) {
        let popularSongs = [];
        try {
          popularSongs = JSON.parse(artist.popularSongs);
        } catch (e) {
          console.error("Error parsing popularSongs:", e);
        }
        const artistDetails = {
          id: artist.id,
          name: artist.name,
          bio: artist.bio,
          funFact: artist.funFact,
          genre: artist.genre,
          popularSongs: popularSongs,
          songCount: artist.songCount || popularSongs.length,
        };
        callback(null, artistDetails);
      } else {
        callback(null, null);
      }
    }
  );
}

// Updated artists endpoints
app.get("/artists", (req, res) => {
  retrieveAllArtists((err, data) => {
    if (err) {
      res.status(500).send("Error retrieving artists");
    } else {
      res.json(data);
    }
  });
});

app.get("/artists/:name", (req, res) => {
  const artistName = req.params.name;
  console.log("Received request for artist:", artistName);

  retrieveArtistDetails(artistName, (err, data) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).send("Error retrieving artist details");
    } else if (!data) {
      console.log("No artist found with name:", artistName);
      res.status(404).send("Artist not found");
    } else {
      res.json(data);
    }
  });
});

// Add this temporary endpoint to check database contents
app.get("/debug/artists", (req, res) => {
  dbArtists.all("SELECT name FROM artists", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log("Server app listening on port " + port);
});
