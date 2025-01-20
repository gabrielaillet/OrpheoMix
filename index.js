import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Route for sons.html
app.get("/html/sons.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "sons.html"));
});

// Route for artistes.html
app.get("/html/artistes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html", "artistes.html"));
});

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});