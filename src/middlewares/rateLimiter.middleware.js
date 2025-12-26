const rateLimit = require('express-rate-limit');
const { default: RedisStore } = require('rate-limit-redis');
const redisClient = require('../../config/redis');

// 일반 API Rate Limiter (100 requests/15min)
const apiLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:api:'
    }),
    windowMs: 15 * 60 * 1000, // 15분
    max: 100, // 최대 100 요청
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            timestamp: new Date().toISOString(),
            path: req.path,
            status: 429,
            code: 'TOO_MANY_REQUESTS',
            message: '너무 많은 요청이 발생했습니다. 15분 후 다시 시도해주세요.',
            details: null
        });
    }
});

// 인증 API Rate Limiter (5 requests/15min)
const authLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:auth:'
    }),
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            timestamp: new Date().toISOString(),
            path: req.path,
            status: 429,
            code: 'TOO_MANY_AUTH_ATTEMPTS',
            message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
            details: null
        });
    }
});

module.exports = { apiLimiter, authLimiter };