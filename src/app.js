const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// Swagger 경로만 helmet 제외
app.use((req, res, next) => {
    if (req.path.startsWith('/docs')) {
        return next();
    }
    helmet()(req, res, next);
});

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
app.use('/api', reviewRoutes);      // /api/books/:bookId/reviews, /api/reviews/...
app.use('/api', commentRoutes);     // /api/reviews/:reviewId/comments, /api/comments/...
app.use('/api', likeRoutes);        // /api/reviews/:id/like, /api/comments/:id/like
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

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Handler
const notFoundMiddleware = require('./middlewares/notFound.middleware');
app.use(notFoundMiddleware);

// Error Handler
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

module.exports = app;