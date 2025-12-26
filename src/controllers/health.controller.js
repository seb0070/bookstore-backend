const { sequelize } = require('../models');
const redisClient = require('../../config/redis');

exports.healthCheck = async (req, res) => {
    const health = {
        status: 'OK',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            database: 'unknown',
            redis: 'unknown'
        }
    };

    try {
        await sequelize.authenticate();
        health.services.database = 'healthy';
    } catch (error) {
        health.services.database = 'unhealthy';
        health.status = 'DEGRADED';
    }

    try {
        await redisClient.ping();
        health.services.redis = 'healthy';
    } catch (error) {
        health.services.redis = 'unhealthy';
        health.status = 'DEGRADED';
    }

    if (
        health.services.database === 'unhealthy' &&
        health.services.redis === 'unhealthy'
    ) {
        return res.status(503).json({
            ...health,
            status: 'UNAVAILABLE',
            message: '서비스를 사용할 수 없습니다.'
        });
    }

    res.status(200).json(health);
};