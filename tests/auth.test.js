const request = require('supertest');
const { app, createTestUser, loginTestUser } = require('./helpers');

describe('Auth API Tests', () => {
    describe('POST /api/auth/signup', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                email: `test${Date.now()}@example.com`,
                password: 'Test1234!@',
                name: '홍길동',
                gender: 'MALE'
            };

            const response = await request(app)
                .post('/api/auth/signup')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe(userData.email);
            expect(response.body.name).toBe(userData.name);
            expect(response.body.role).toBe('USER');
        });

        it('should fail with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'invalid-email',
                    password: 'Test1234!@',
                    name: '테스트'
                })
                .expect(400);

            expect(response.body.code).toBe('VALIDATION_FAILED');
        });

        it('should fail with duplicate email', async () => {
            const email = `test${Date.now()}@example.com`;

            // 첫 번째 회원가입
            await request(app)
                .post('/api/auth/signup')
                .send({
                    email,
                    password: 'Test1234!@',
                    name: '테스트1'
                });

            // 중복 이메일로 회원가입 시도
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email,
                    password: 'Test1234!@',
                    name: '테스트2'
                })
                .expect(409);

            expect(response.body.code).toBe('DUPLICATE_EMAIL');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid credentials', async () => {
            const { credentials } = await createTestUser();

            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: credentials.email,
                    password: credentials.password
                })
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body.user).toHaveProperty('email', credentials.email);
        });

        it('should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'WrongPassword123!@'
                })
                .expect(401);

            expect(response.body.code).toBe('INVALID_CREDENTIALS');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const { credentials } = await createTestUser();
            const { accessToken } = await loginTestUser(credentials.email, credentials.password);

            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.message).toBeDefined();
        });

        it('should fail without token', async () => {
            await request(app)
                .post('/api/auth/logout')
                .expect(401);
        });
    });
});