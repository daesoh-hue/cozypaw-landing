const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (CSS, JS, images)
const staticDir = process.cwd();
app.use(express.static(staticDir));

// Serve index.html for all routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🐾 CozyPaw landing page running on port ${PORT}`);
  console.log(`Ready for drop day!`);
});
