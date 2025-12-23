const express = require('express');
const app = express();

const bookRoutes = require('./routes/book.routes');

app.use(express.json());
app.use('/api/books', bookRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: '1.0.0',
    });
});

module.exports = app;
