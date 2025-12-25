// 모든 라우트에 매칭되지 않은 요청 처리
module.exports = (req, res, next) => {
    res.status(404).json({
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        status: 404,
        code: 'RESOURCE_NOT_FOUND',
        message: '요청한 리소스를 찾을 수 없습니다.',
        details: null
    });
};