module.exports = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 400,
                code: 'VALIDATION_FAILED',
                message: '입력값 검증 실패',
                details: error.details.map(d => ({
                    field: d.path.join('.'),
                    message: d.message,
                })),
            });
        }

        next();
    };
};
