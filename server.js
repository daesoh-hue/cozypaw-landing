const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Read index.html at startup
const indexPath = path.join(__dirname, 'index.html');
let indexContent;

try {
  indexContent = fs.readFileSync(indexPath, 'utf8');
  console.log(`✓ Loaded index.html (${indexContent.length} bytes)`);
} catch (err) {
  console.error('ERROR: Could not read index.html:', err.message);
  indexContent = '<h1>Error: Could not load landing page</h1>';
}

// Serve static files (CSS, JS, images, etc)
app.use(express.static(__dirname));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(indexContent);
});

// Start server
app.listen(PORT, () => {
  console.log(`🐾 CozyPaw landing page running on port ${PORT}`);
  console.log(`Ready for drop day!`);
});
