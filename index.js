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
