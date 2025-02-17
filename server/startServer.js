import sqlite3 from "sqlite3";
import express from "express";
import cors from "cors";

sqlite3.verbose();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Single database connection
const db = new sqlite3.Database("db/playlistDB.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the unified database");
  }
});

// Updated function to retrieve all tracks
function retrieveAll(callback) {
  db.all(`SELECT * FROM songs`, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Updated function to retrieve text info
function retrieveText(callback) {
  db.all(`SELECT id, title, artist FROM songs`, (err, rows) => {
    if (err) {
      console.error(err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Updated function to retrieve by genre
function retrieveByGenre(genre, callback) {
  db.all(
    `SELECT id, title, artist FROM songs WHERE genre = ?`,
    [genre],
    (err, rows) => {
      if (err) {
        console.error("Error retrieving songs:", err.message);
        callback(err, null);
      } else if (rows && rows.length > 0) {
        callback(null, rows);
      } else {
        console.log("No songs found for the given genre.");
        callback(null, []);
      }
    }
  );
}

// Updated function to retrieve by ID
function retrieveById(id, callback) {
  db.get(
    `SELECT id, title, audio FROM songs WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error retrieving song:", err.message);
        callback(err, null);
      } else if (row) {
        callback(null, row);
      } else {
        console.log("No song found with the given ID.");
        callback(null, null);
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

app.post("/addMusic", (req, res) => {
  console.log(`Incoming request size: ${req.headers["content-length"]} bytes`);
  const { title, artist, genre, cover, song } = req.body;
  const coverBinary = cover ? Buffer.from(cover.split(",")[1], "base64") : null;
  const songBinary = Buffer.from(song.split(",")[1], "base64");

  db.run(
    `INSERT INTO songs (title, cover, artist, genre, audio) VALUES (?, ?, ?, ?, ?)`,
    [title, coverBinary, artist, genre, songBinary],
    function (err) {
      if (err) {
        console.error("Error inserting MP3 file:", err.message);
      } else {
        console.log(`MP3 file inserted with ID: ${this.lastID}`);
      }
    }
  );
});
app.get("/audio/:trackId", (req, res) => {
  const trackId = req.params.trackId; // Récupère l'ID de la piste audio

  // Récupérer le fichier audio BLOB depuis la base de données
  db.get("SELECT audio FROM songs WHERE id = ?", [trackId], (err, row) => {
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
  db.get("SELECT cover FROM songs WHERE id = ?", [trackId], (err, row) => {
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

// Updated authentication routes
app.post("/signup", (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).send("Pseudo and password are required.");
  }

  db.get(`SELECT * FROM users WHERE pseudo = ?`, [pseudo], (err, row) => {
    if (err) {
      console.error("Error checking user existence:", err.message);
      return res.status(500).send("Error checking user existence.");
    }

    if (row) {
      return res.status(400).send("This pseudo is already taken.");
    }

    db.run(
      `INSERT INTO users (pseudo, password) VALUES (?, ?)`,
      [pseudo, password],
      function (err) {
        if (err) {
          console.error("Error inserting user:", err.message);
          return res.status(500).send("Error registering user.");
        }
        res
          .status(201)
          .send({ message: "User registered successfully", id: this.lastID });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(400).send("Pseudo and password are required.");
  }

  db.get(
    `SELECT id, pseudo FROM users WHERE pseudo = ? AND password = ?`,
    [pseudo, password],
    (err, row) => {
      if (err) {
        console.error("Error querying database:", err.message);
        return res.status(500).send("Error logging in.");
      }

      if (!row) {
        return res.status(401).send("Invalid credentials.");
      }

      res.status(200).json({ message: "Login successful", id: row.id });
    }
  );
});

// Get user's playlists
app.get("/playlists/:userId/playlists", (req, res) => {
  const userId = req.params.userId;
  db.all("SELECT * FROM playlists WHERE ownerId = ?", [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error fetching playlists" });
    } else {
      res.json(rows);
    }
  });
});

// Get user's playlists' titles
app.get("/playlists/:userId/playlists/title", (req, res) => {
  const userId = req.params.userId;
  db.all(
    `SELECT title FROM playlists WHERE ownerId = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Error fetching playlists" });
      } else {
        res.json(rows);
      }
    }
  );
});

// Get playlist songs
app.get("/playlists/:playlistId", (req, res) => {
  const playlistId = req.params.playlistId;
  db.all(
    `SELECT songs.* FROM songs 
     JOIN playlist_songs ON songs.id = playlist_songs.songId 
     WHERE playlist_songs.playlistId = ?`,
    [playlistId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Error fetching playlist songs" });
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/playlists/:userId", (req, res) => {
  const { title } = req.body;
  const userId = req.params.userId;
  db.run(
    "INSERT INTO playlists (title, ownerId) VALUES (?, ?)",
    [title, userId],
    function (err) {
      if (err) {
        console.error("Error creating playlist:", err.message);
        return res.status(500).send("Error creating playlist.");
      }
      res
        .status(201)
        .send({ message: "Playlist created successfully", id: this.lastID });
    }
  );
});

app.post("/playlists/:userId/delete", (req, res) => {
  const { playlistId } = req.body;

  // Begin transaction to ensure both operations succeed or fail together
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // First delete all entries from playlist_songs
    db.run(
      "DELETE FROM playlist_songs WHERE playlistId = ?",
      [playlistId],
      (err) => {
        if (err) {
          console.error("Error deleting playlist songs:", err.message);
          db.run("ROLLBACK");
          return res.status(500).send("Error deleting playlist songs.");
        }

        // Then delete the playlist itself
        db.run("DELETE FROM playlists WHERE id = ?", [playlistId], (err) => {
          if (err) {
            console.error("Error deleting playlist:", err.message);
            db.run("ROLLBACK");
            return res.status(500).send("Error deleting playlist.");
          }

          db.run("COMMIT");
          res
            .status(200)
            .send({ message: "Playlist and its songs deleted successfully" });
        });
      }
    );
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

// Endpoint to retrieve the playlists
app.get("/playlists", (req, res) => {
  playlistDb.all(`SELECT id, title FROM playlists`, [], (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "An unexpected error occurred" });
    } else if (rows.length === 0) {
      res.status(404).json({ message: "No playlists found" });
    } else {
      res.json(rows);
    }
  });
});

app.post("/playlists/:userId/add", (req, res) => {
  const userId = req.params.userId;
  const { playlistId, songId } = req.body;

  if (!playlistId || !songId) {
    return res
      .status(400)
      .json({ error: "Playlist ID and Song ID are required" });
  }

  db.run(
    "INSERT INTO playlist_songs (playlistId, songId) VALUES (?, ?)",
    [playlistId, songId],
    function (err) {
      if (err) {
        return res
          .status(409)
          .json({ error: "The selected song already exists in this playlist" });
      }
      res.status(200).json({ message: "Song added to playlist successfully" });
    }
  );
});

// Add this new endpoint for deleting songs
app.delete("/songs/:id", (req, res) => {
  const songId = req.params.id;

  // Begin transaction
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // First, delete the song from playlist_songs table
    db.run("DELETE FROM playlist_songs WHERE songId = ?", [songId], (err) => {
      if (err) {
        console.error("Error deleting song from playlists:", err.message);
        db.run("ROLLBACK");
        return res
          .status(500)
          .json({ error: "Error deleting song from playlists" });
      }

      // Then delete the song from songs table
      db.run("DELETE FROM songs WHERE id = ?", [songId], (err) => {
        if (err) {
          console.error("Error deleting song:", err.message);
          db.run("ROLLBACK");
          return res.status(500).json({ error: "Error deleting song" });
        }

        db.run("COMMIT");
        res.status(200).json({ message: "Song deleted successfully" });
      });
    });
  });
});

app.listen(port, () => {
  console.log("Server app listening on port " + port);
});
