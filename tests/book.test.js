const request = require('supertest');
const { app, loginAdmin, createTestBook } = require('./helpers');

describe('Book API Tests', () => {
    let adminToken;

    beforeAll(async () => {
        const admin = await loginAdmin();
        adminToken = admin.accessToken;
    });

    describe('GET /api/books', () => {
        it('should get books list without authentication', async () => {
            const response = await request(app)
                .get('/api/books')
                .expect(200);

            expect(response.body).toHaveProperty('content');
            expect(Array.isArray(response.body.content)).toBe(true);
            expect(response.body).toHaveProperty('totalElements');
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/books?page=0&size=5')
                .expect(200);

            expect(response.body.content.length).toBeLessThanOrEqual(5);
            expect(response.body.page).toBe(0);
            expect(response.body.size).toBe(5);
        });

        it('should support search by keyword', async () => {
            const response = await request(app)
                .get('/api/books?keyword=자바')
                .expect(200);

            expect(response.body.content).toBeDefined();
        });
    });

    describe('POST /api/books', () => {
        it('should create a book with admin role', async () => {
            const bookData = {
                title: '새로운 테스트 도서',
                description: '테스트 설명',
                authors: ['작가1', '작가2'],
                categories: ['IT', '프로그래밍'],
                publisher: '테스트 출판사',
                price: 25000,
                published_year: 2024,
                stock_quantity: 50
            };

            const response = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(bookData)
                .expect(201);

            expect(response.body.title).toBe(bookData.title);
            // price는 숫자 또는 문자열 둘 다 허용
            expect(parseInt(response.body.price)).toBe(bookData.price);
        });

        it('should fail without admin role', async () => {
            const response = await request(app)
                .post('/api/books')
                .send({
                    title: '테스트',
                    authors: ['작가'],
                    categories: ['카테고리'],
                    price: 10000,
                    published_year: 2024
                })
                .expect(401);

            expect(response.body.code).toBe('UNAUTHORIZED');
        });
    });

    describe('PATCH /api/books/:id', () => {
        it('should update a book with admin role', async () => {
            const book = await createTestBook(adminToken);

            const response = await request(app)
                .patch(`/api/books/${book.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 30000 })
                .expect(200);

            // price는 숫자 또는 문자열 둘 다 허용
            expect(parseInt(response.body.price)).toBe(30000);
        });
    });
});