module.exports = (err, req, res, next) => {
    console.error(err);

    const status = err.status || 500;

    res.status(status).json({
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        status,
        code: err.code || err.message || 'INTERNAL_SERVER_ERROR',
        message: err.message || '서버 오류가 발생했습니다',
    });
};