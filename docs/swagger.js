const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bookstore API',
            version: '1.0.0',
            description: 'WSD 과제용 Bookstore REST API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            responses: {
                UnauthorizedError: {
                    description: '인증 실패',
                },
                ForbiddenError: {
                    description: '권한 없음',
                },
                ValidationError: {
                    description: '입력값 검증 실패',
                },
                NotFoundError: {
                    description: '리소스 없음',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/*.js',
        './src/controllers/*.js',
    ],
};

module.exports = swaggerJsdoc(options);
