require('dotenv').config();

const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// DB 연결 확인
db.sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected');

        // 서버 시작
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Docs: http://localhost:${PORT}/docs`);
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    db.sequelize.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    db.sequelize.close();
    process.exit(0);
});