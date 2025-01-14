const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the port
const PORT = 3000;

// Function to serve files
function serveFile(res, fileName, contentType) {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error loading file: ${filePath}`, err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading the file');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        // Serve the index page
        serveFile(res, 'index.html', 'text/html');
    } else if (req.url === '/index.css') {
        // Serve the CSS for the index page
        serveFile(res, 'index.css', 'text/css');
    } else if (req.url === '/firstpage.html') {
        // Serve the first page
        serveFile(res, 'firstPage/firstPage.html', 'text/html');
    } else if (req.url === '/firstPage.css') {
        // Serve the CSS for the first page
        serveFile(res, 'firstPage/firstPage.css', 'text/css');
    } else if (req.url === '/nextpage.html') {
        // Serve the next page
        serveFile(res, 'nextPage/nextPage.html', 'text/html');
    } else if (req.url === '/nextPage.css') {
        // Serve the CSS for the next page
        serveFile(res, 'nextPage/nextPage.css', 'text/css');
    } else if (req.url === '/buttonGroup.js') {
        // Serve the button group JavaScript file
        serveFile(res, 'buttonGroup.js', 'application/javascript');
    } else {
        // Serve 404 for unknown routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});