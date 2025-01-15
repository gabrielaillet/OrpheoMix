const http = require("http");
const fs = require("fs");
const path = require("path");

// Define the port
const PORT = 3000;

// Function to serve files
function serveFile(res, fileName, contentType) {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`Error loading file: ${filePath}`, err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading the file");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    // Serve the index page
    serveFile(res, "index.html", "text/html");


  } else if (req.url === "/css/index.css") {
    // Serve the CSS for the index page
    serveFile(res, "/css/index.css", "text/css");
  } else if (req.url === "/css/firstPage.css") {
    // Serve the CSS for the first page
    serveFile(res, "/css/firstPage.css", "text/css");
  } else if (req.url === "/css/nextPage.css") {
    // Serve the CSS for the next page
    serveFile(res, "/css/nextPage.css", "text/css");
  } else if (req.url === "/css/bootstrap.min.css") {
    // Serve the CSS for the next page
    serveFile(res, "/css/bootstrap.min.css", "text/css");
  } 
  
  
  
  else if (req.url === "/firstpage.html") {
    // Serve the first page
    serveFile(res, "/html/firstPage.html", "text/html");
  } else if (req.url === "/nextpage.html") {
    // Serve the next page
    serveFile(res, "/html/nextPage.html", "text/html");
  }
  else if (req.url === "/js/buttonGroup.js") {
    // Serve the button group JavaScript file
    serveFile(res, "js/buttonGroup.js", "application/javascript");
  }   else if (req.url === "/js/bootstrap.bundle.min.js") {
    // Serve the button group JavaScript file
    serveFile(res, "/js/bootstrap.bundle.min.js", "application/javascript");
  } 

  else {
    // Serve 404 for unknown routes
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
