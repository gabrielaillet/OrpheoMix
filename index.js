import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Serve static files from the "public" directory
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false, // Prevent serving "index.html" automatically
  })
);

// // Route for sons.html
// app.get("/html/sons.html", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "html", "sons.html"));
// });

// // Route for artistes.html
// app.get("/html/artistes.html", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "html", "artistes.html"));
// });

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "admin.html"));
});

app.get("/main", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/html/authPage.html"));
});

// // Default route
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

app.use((req, res) => {
  res.redirect("/");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




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

