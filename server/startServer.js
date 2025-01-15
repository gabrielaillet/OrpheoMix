const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const port = 8000;

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

function retrieveById(id, outputPath, outputText ) {
  db.get(
    `SELECT title, cover, artist, audio FROM tracks WHERE id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error('Error retrieving MP3 file:', err.message);
      } else if (row) {
        fs.writeFileSync(outputPath, row.audio); // Save the binary data as a file
        fs.writeFileSync(outputText, row.title); // Save the binary data as a file
        console.log(`MP3 file saved to: ${outputPath}`);
      } else {
        console.log('No track found with the given ID.');
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
  
    retrieveById(trackId, outputPath, outputText, (err, row) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération de la piste.');
      } else if (!row) {
        res.status(404).send('Aucune piste trouvée avec cet ID.');
      } else {
        res.json({
          message: 'Fichier MP3 et titre enregistrés avec succès.',
          details: {
            id: row.id,
            title: row.title
          },
        });
      }
    });
  });

app.listen(port, () => {
  console.log('Server app listening on port ' + port);
});
