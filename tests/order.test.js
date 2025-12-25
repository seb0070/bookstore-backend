const request = require('supertest');
const { app, createTestUser, loginTestUser, loginAdmin, createTestBook } = require('./helpers');

describe('Order API Tests', () => {
    let accessToken;
    let adminToken;
    let bookId;

    beforeAll(async () => {
        // 일반 사용자
        const { credentials } = await createTestUser();
        const loginData = await loginTestUser(credentials.email, credentials.password);
        accessToken = loginData.accessToken;

        // 관리자
        const admin = await loginAdmin();
        adminToken = admin.accessToken;

        // 테스트용 도서 생성
        const book = await createTestBook(adminToken);
        bookId = book.id;
    });

    describe('POST /api/orders', () => {
        it('should create an order successfully', async () => {
            const orderData = {
                items: [
                    {
                        book_id: bookId,
                        quantity: 2
                    }
                ]
            };

            const response = await request(app)
                .post('/api/orders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toBe('PENDING');
            expect(response.body.items).toHaveLength(1);
        });

        it('should fail without authentication', async () => {
            await request(app)
                .post('/api/orders')
                .send({
                    items: [{ book_id: 1, quantity: 1 }]
                })
                .expect(401);
        });
    });

    describe('GET /api/orders/me', () => {
        it('should get my orders', async () => {
            const response = await request(app)
                .get('/api/orders/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('content');
            expect(Array.isArray(response.body.content)).toBe(true);
        });
    });
});