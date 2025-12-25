const request = require('supertest');
const { app, createTestUser, loginTestUser } = require('./helpers');

describe('User API Tests', () => {
    let accessToken;
    let userId;

    beforeAll(async () => {
        const { credentials } = await createTestUser();
        const loginData = await loginTestUser(credentials.email, credentials.password);
        accessToken = loginData.accessToken;
        userId = loginData.user.id;
    });

    describe('GET /api/users/me', () => {
        it('should get current user info', async () => {
            const response = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', userId);
            expect(response.body).toHaveProperty('email');
            expect(response.body).not.toHaveProperty('password_hash');
        });

        it('should fail without authentication', async () => {
            await request(app)
                .get('/api/users/me')
                .expect(401);
        });
    });

    describe('PATCH /api/users/me', () => {
        it('should update user info', async () => {
            const response = await request(app)
                .patch('/api/users/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    name: '수정된이름',
                    address: '서울시 강남구'
                })
                .expect(200);

            expect(response.body.name).toBe('수정된이름');
            expect(response.body.address).toBe('서울시 강남구');
        });
    });

    describe('DELETE /api/users/me', () => {
        it('should delete user account (soft delete)', async () => {
            const { credentials } = await createTestUser();
            const { accessToken: newToken } = await loginTestUser(credentials.email, credentials.password);

            const response = await request(app)
                .delete('/api/users/me')
                .set('Authorization', `Bearer ${newToken}`)
                .expect(200);

            expect(response.body.message).toBeDefined();
        });
    });
});