// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// User ID (change as necessary)
const user_id = "john_doe_17091999";

// POST endpoint for file upload
app.post('/bfhl', upload.single('file'), (req, res) => {
    let is_success = false;
    let file_info = {
        file_valid: false,
        file_mime_type: null,
        file_size_kb: 0
    };

    // Check if a file was uploaded
    if (req.file) {
        file_info.file_valid = true;
        file_info.file_mime_type = req.file.mimetype;
        file_info.file_size_kb = (req.file.size / 1024).toFixed(2); // size in KB
        is_success = true; // Assuming the operation is successful if a file is uploaded
    }

    // Prepare the response
    const response = {
        user_id: user_id,
        is_success: is_success,
        file_info: file_info
    };

    res.json(response);
});

// GET endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Serve static files from the React app (if you move the frontend into this directory)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});