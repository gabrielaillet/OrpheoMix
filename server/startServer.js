const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
const db = new sqlite3.Database('db/music2.db');

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

function retrieveById(id, callback) {
  db.get(
    `SELECT id, title, audio FROM tracks WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error('Error retrieving track:', err.message);
        callback(err, null); // Passe l'erreur au rappel
      } else if (row) {
        callback(null, row); // Passe les données au rappel
      } else {
        console.log('No track found with the given ID.');
        callback(null, null); // Indique qu'aucune piste n'a été trouvée
      }
    }
  );
}

app.get('/', (req, res) => {
  res.send('Hello world !!');
});

app.get('/db', (req, res) => {
  retrieveAll((err, data) => {
    if (err) {
      res.status(500).send('Error retrieving data');
    } else {
      res.json(data); // Send data as JSON
    }
  });
});

//   ici pour récupérer les ids 
app.get('/db/:id', (req, res) => {
    const trackId = req.params.id; // Récupère l'ID de l'URL
    const outputPath = `output/track_${trackId}.mp3`; // Chemin pour enregistrer le fichier audio
    const outputText = `output/track_${trackId}.txt`; // Chemin pour enregistrer le titre
  
    retrieveById(trackId, (err, row) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération de la piste.');
      } else if (!row) {
        res.status(404).send('Aucune piste trouvée avec cet ID.');
      } else {
        res.json({
          message: 'Fichier MP3 et titre enregistrés avec succès.',
          details: {
            id: row.id,
            title: row.title,
            audio: row.audio
          },
        });
      }
    });
  });

app.get('/audio/:trackId', (req, res) => {
    const trackId = req.params.trackId; // Récupère l'ID de la piste audio

    // Récupérer le fichier audio BLOB depuis la base de données
    db.get('SELECT audio FROM tracks WHERE id = ?', [trackId], (err, row) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération du fichier audio.');
            console.error(err);
        } else if (!row) {
            res.status(404).send('Aucune piste trouvée avec cet ID.');
        } else {
            // Envoie le fichier BLOB au client avec le bon type MIME
            res.setHeader('Content-Type', 'audio/mpeg'); // Type MIME pour les fichiers MP3
            res.send(row.audio); // Envoie le BLOB du fichier MP3
        }
    });
});
app.listen(port, () => {
  console.log('Server app listening on port ' + port);
});
