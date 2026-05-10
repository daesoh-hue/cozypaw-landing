const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`Starting server on port ${PORT}...`);
console.log(`CWD: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Read HTML file
const htmlPath = path.join(__dirname, 'index.html');
console.log(`Looking for HTML at: ${htmlPath}`);

let html = '';
try {
  html = fs.readFileSync(htmlPath, 'utf8');
  console.log(`✓ Successfully loaded index.html (${html.length} bytes)`);
} catch (e) {
  console.error(`✗ Failed to load index.html:`, e.message);
  html = '<h1>Landing page not found</h1>';
}

// Serve static assets
app.use(express.static(__dirname));

// Serve HTML for all routes
app.all('*', (req, res) => {
  res.type('text/html').send(html);
});

const server = app.listen(PORT, () => {
  console.log(`🐾 Server running on port ${PORT}`);
  console.log(`Ready for drop day!`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
