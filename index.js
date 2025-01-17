import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";

// Determine the absolute path of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port
const PORT = 3000;

// Create an instance of express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbPath = path.join(__dirname, "authentificationPage", "db", "users.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error creating database:", err.message);
  } else {
    console.log("COnnected to the database", dbPath);
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
  db.get(checkQuery, [pseudo], (err, row) => {
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
    db.run(insertQuery, [pseudo, password], function (err) {
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

  const query = `SELECT * FROM users WHERE pseudo = ? AND password = ?`;
  db.get(query, [pseudo, password], (err, row) => {
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
    res.status(200).json({ message: "Login successful" });
  });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define routes for HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
