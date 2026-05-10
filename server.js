const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

console.log(`Starting server on port ${PORT}...`);
console.log(`CWD: ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);

// Serve all static files (HTML, CSS, JS, images, etc.)
app.use(express.static(__dirname));

// List available HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
console.log(`✓ Available HTML files: ${htmlFiles.join(', ')}`);

// Handle routing - serve the requested HTML file or index.html as fallback
app.get('*', (req, res) => {
  let filePath = path.join(__dirname, req.path);

  // If path doesn't have extension, try .html
  if (!path.extname(filePath)) {
    filePath = path.join(__dirname, req.path + '.html');
  }

  // Check if file exists
  if (fs.existsSync(filePath) && filePath.endsWith('.html')) {
    console.log(`Serving: ${filePath}`);
    res.type('text/html').sendFile(filePath);
  } else {
    // Fallback to index.html
    console.log(`File not found: ${filePath}, serving index.html`);
    res.type('text/html').sendFile(path.join(__dirname, 'index.html'));
  }
});

const server = app.listen(PORT, () => {
  console.log(`🐾 CozyPaw Server running on port ${PORT}`);
  console.log(`Ready for drop day!`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
