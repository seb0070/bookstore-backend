const express = require('express');
const errorMiddleware = require('./middlewares/error.middleware');
const app = express();
const bookRoutes = require('./routes/book.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', bookRoutes);
app.use('/api/users', require('./routes/user.routes'));

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: '1.0.0',
    });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

module.exports = app;
