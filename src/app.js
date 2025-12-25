const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// 기본 미들웨어
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../docs/swagger');

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const bookRoutes = require('./routes/book.routes');
const orderRoutes = require('./routes/order.routes');
const reviewRoutes = require('./routes/review.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const statsRoutes = require('./routes/stats.routes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', reviewRoutes);
app.use('/api', commentRoutes);
app.use('/api', likeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Swagger Documentation (수정된 부분)
const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const swaggerOptions = {
    swaggerOptions: {
        url: '/api-docs.json',
    },
    customCss: '.swagger-ui .topbar { display: none }',
};

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/docs', express.static(swaggerUiAssetPath), swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// 404 Handler
const notFoundMiddleware = require('./middlewares/notFound.middleware');
app.use(notFoundMiddleware);

// Error Handler
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;