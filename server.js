const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Get the directory where files are
const fileDir = process.cwd();

console.log(`Serving files from: ${fileDir}`);
console.log(`Index.html exists: ${fs.existsSync(path.join(fileDir, 'index.html'))}`);

// Serve static files (CSS, JS, images)
app.use(express.static(fileDir));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', cwd: process.cwd() });
});

// Serve index.html for all routes (SPA fallback)
app.get('*', (req, res) => {
  const indexPath = path.join(fileDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(404).send('File not found');
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🐾 CozyPaw landing page running on port ${PORT}`);
  console.log(`Ready for drop day!`);
});
