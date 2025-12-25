const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bookstore API',
            version: '1.0.0',
            description: '온라인 서점 백엔드 API - 웹서비스설계 2분반 과제2',
            contact: {
                name: '정세빈',
                email: 'student@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'http://113.198.66.75:PORT',
                description: 'JCloud server'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Authorization header using the Bearer scheme.'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js'] // routes 폴더의 모든 파일에서 Swagger 주석 읽기
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;