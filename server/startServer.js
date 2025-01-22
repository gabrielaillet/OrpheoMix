import sqlite3 from "sqlite3";
import express from "express";
import cors from "cors";

sqlite3.verbose();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

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
  db.all(`SELECT title FROM playlists WHERE ownerId = ?`, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error fetching playlists" });
    } else {
      res.json(rows);
    }
  });
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
  const {title} = req.body;
  const userId = req.params.userId;
  db.run(
    'INSERT INTO playlists (title, ownerId) VALUES (?, ?)',
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
  )
})

app.post("/playlists/:userId/delete", (req, res) => {
  const { playlistId } = req.body;
  db.run(
    'DELETE FROM playlists WHERE id = ?',
    [playlistId],
    function (err) {
      if (err) {
        console.error("Error deleting playlist:", err.message);
        return res.status(500).send("Error deleting playlist.");
      }
      res
        .status(200)
        .send({ message: "Playlist deleted successfully" });
    }
  );
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

// Add dummy data for testing playlists
function insertDummyPlaylistData() {
  // Insert test users
  db.run(`INSERT OR IGNORE INTO users (id, username) VALUES (1, 'testUser')`);

  // Insert test songs
  const songQueries = [
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (1, 'Bohemian Rhapsody', 'Queen', 354)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (2, 'Hotel California', 'Eagles', 391)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (3, 'Sweet Child O Mine', 'Guns N Roses', 356)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (4, 'Beat It', 'Michael Jackson', 258)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (5, 'Stairway to Heaven', 'Led Zeppelin', 482)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (6, 'Imagine', 'John Lennon', 183)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (7, 'Smells Like Teen Spirit', 'Nirvana', 301)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (8, 'Wonderwall', 'Oasis', 258)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (9, 'Hey Jude', 'The Beatles', 431)`,
    `INSERT OR IGNORE INTO songs (id, title, artist, duration) VALUES (10, 'Like a Rolling Stone', 'Bob Dylan', 369)`,
  ];

  // Insert test playlists
  const playlistQueries = [
    `INSERT OR IGNORE INTO playlists (id, title, ownerId) VALUES (1, 'Rock Classics', 2)`,
    `INSERT OR IGNORE INTO playlists (id, title, ownerId) VALUES (2, 'Best Hits', 2)`,
    `INSERT OR IGNORE INTO playlists (id, title, ownerId) VALUES (3, 'My Favorites', 2)`,
    `INSERT OR IGNORE INTO playlists (id, title, ownerId) VALUES (4, 'Chill Vibes', 2)`,
    `INSERT OR IGNORE INTO playlists (id, title, ownerId) VALUES (5, 'Party Mix', 2)`,
  ];

  // Insert playlist-song relationships
  const playlistSongQueries = [
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (1, 1)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (1, 2)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (1, 3)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (1, 4)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (1, 5)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (2, 6)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (2, 7)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (2, 8)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (2, 9)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (2, 10)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (3, 1)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (3, 3)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (3, 5)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (3, 7)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (3, 9)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (4, 2)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (4, 4)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (4, 6)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (4, 8)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (4, 10)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (5, 1)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (5, 2)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (5, 3)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (5, 4)`,
    `INSERT OR IGNORE INTO playlist_songs (playlistId, songId) VALUES (5, 5)`,
  ];

  // Execute all queries
  const queries = [...songQueries, ...playlistQueries, ...playlistSongQueries];
  queries.forEach((query) => {
    db.run(query, (err) => {
      if (err) {
        console.error("Error inserting dummy data:", err.message);
      }
    });
  });

  console.log("Dummy playlist data inserted successfully");
}

// Call this function after database connection
insertDummyPlaylistData();

// Endpoint to retrieve the playlists 
app.get("/playlists", (req, res) => {
  playlistDb.all(
    `SELECT id, title FROM playlists`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "An unexpected error occurred" });
      } else if (rows.length === 0) {
        res.status(404).json({ message: "No playlists found" });
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/playlists/:userId/add", (req, res) => {
  const userId = req.params.userId;
  const { playlistId, songId } = req.body;  

  if (!playlistId || !songId) {
    return res.status(400).json({ error: "Playlist ID and Song ID are required" });
  }

  db.run(
    "INSERT INTO playlist_songs (playlistId, songId) VALUES (?, ?)",
    [playlistId, songId],
    function (err) {
      if (err) {
        return res.status(409).json({ error: "The selected song already exists in this playlist" });
      }
      res.status(200).json({ message: "Song added to playlist successfully" });
    }
  );
});

app.listen(port, () => {
  console.log("Server app listening on port " + port);
});

app.post("/addMusic", (req, res) => {
  console.log(`Incoming request size: ${req.headers['content-length']} bytes`);
  const { title, artist, genre,cover,song } = req.body;

  console.log({ title, artist, genre,cover,song })
  db.run(
    `INSERT INTO tracks (title, cover, artist, genre, audio) VALUES (?, ?, ?, ?, ?)`,
    [title, cover, artist, genre, song],
    function (err) {
      if (err) {
        console.error("Error inserting MP3 file:", err.message);
      } else {
        console.log(`MP3 file inserted with ID: ${this.lastID}`);
      }
    }
  );
});
