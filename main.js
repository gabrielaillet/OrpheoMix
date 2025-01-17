import express from "express";
import database from "./db/db.js";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/songs", (req, res) => {
  try {
    const songs = database.prepare("SELECT * FROM songs").all();
    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
