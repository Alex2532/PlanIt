const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});

