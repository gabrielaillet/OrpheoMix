/* const http = require('http');
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
    } else if (req.url === 'service-worker.js', 'application/javascript') {
        // Serve the service worker
        serveFile(res, '/service-worker.js');
    } else {
        // Serve 404 for unknown routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});



///// Handle the cache

// Register the file service-worker.js, if available in the navigator
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

//////


// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); */



const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper function to serve files
function serveFile(res, filePath, mimeType) {
    const fullPath = path.join(__dirname, '../client', filePath);  // Adjusted to point to the client directory

    // Validate MIME type
    if (!mimeType) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: Missing MIME type');
        return;
    }

    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Define the routes dynamically based on the file extension
    const routes = [
        { route: '/', file: 'index.html', mimeType: 'text/html' },
        { route: '/index.html', file: 'index.html', mimeType: 'text/html' },
        { route: '/index.css', file: 'index.css', mimeType: 'text/css' },
        { route: '/index.js', file: 'index.js', mimeType: 'application/javascript' },
        { route: '/service-worker.js', file: 'service-worker.js', mimeType: 'application/javascript' },
        //{ route: '/favicon.ico', file: 'favicon.ico', mimeType: 'image/x-icon' },
    ];

    // Serve the requested route, or send 404 if not found
    const route = routes.find(r => r.route === req.url);
    if (route) {
        serveFile(res, route.file, route.mimeType);
    } else if (req.url.startsWith('/firstPage')) {
        // Serve the firstPage files
        const firstPagePath = req.url.replace('/firstPage', '');
        if (firstPagePath === '') {
            serveFile(res, 'firstPage/firstPage.html', 'text/html');
        } else if (firstPagePath === '/firstPage.css') {
            serveFile(res, 'firstPage/firstPage.css', 'text/css');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else if (req.url.startsWith('/nextPage')) {
        // Serve the nextPage files
        const nextPagePath = req.url.replace('/nextPage', '');
        if (nextPagePath === '') {
            serveFile(res, 'nextPage/nextPage.html', 'text/html');
        } else if (nextPagePath === '/nextPage.css') {
            serveFile(res, 'nextPage/nextPage.css', 'text/css');
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

