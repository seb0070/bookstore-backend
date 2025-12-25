require('dotenv').config();

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models');

const createTestUser = async (userData = {}) => {
    const defaultUser = {
        email: `test${Date.now()}@example.com`,
        password: 'Test1234!@',
        name: '테스트유저',
        gender: 'MALE',
        ...userData
    };

    const response = await request(app)
        .post('/api/auth/signup')
        .send(defaultUser);

    if (response.status !== 201) {
        console.error('회원가입 실패:', response.body);
        throw new Error(`회원가입 실패: ${response.body.message || response.status}`);
    }

    return {
        user: response.body,
        credentials: defaultUser
    };
};

const loginTestUser = async (email, password) => {
    const response = await request(app)
        .post('/api/auth/login')
        .send({ email, password });

    if (response.status !== 200) {
        console.error('로그인 실패:', response.body);
        throw new Error(`로그인 실패: ${response.body.message || response.status}`);
    }

    return {
        accessToken: response.body.accessToken,
        refreshToken: response.body.refreshToken,
        user: response.body.user
    };
};

const loginAdmin = async () => {
    try {
        return await loginTestUser('admin1@example.com', 'Admin1234!@');
    } catch (error) {
        console.log('시드 admin1 계정 실패, admin2 시도...');
        try {
            return await loginTestUser('admin2@example.com', 'Admin1234!@');
        } catch (error2) {
            console.log('시드 admin 계정들 실패, 새 admin 계정 생성 중...');

            const adminEmail = `admin${Date.now()}@example.com`;
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: adminEmail,
                    password: 'Admin1234!@',
                    name: '테스트관리자',
                    gender: 'MALE'
                });

            if (response.status !== 201) {
                throw new Error(`Admin 생성 실패: ${response.body.message}`);
            }

            const admin = await db.User.findOne({ where: { email: adminEmail } });
            if (admin) {
                await admin.update({ role: 'ADMIN' });
                console.log('Admin role 설정 완료');
            }

            return await loginTestUser(adminEmail, 'Admin1234!@');
        }
    }
};

const createTestBook = async (adminToken, bookData = {}) => {
    const defaultBook = {
        title: `테스트 도서 ${Date.now()}`,
        description: '테스트용 도서입니다',
        authors: ['테스트 작가'],
        categories: ['테스트'],
        publisher: '테스트 출판사',
        price: 15000,
        published_year: 2024,
        stock_quantity: 100,
        ...bookData
    };

    const response = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(defaultBook);

    if (response.status !== 201) {
        console.error('도서 생성 실패:', response.body);
        throw new Error(`도서 생성 실패: ${response.body.message || response.status}`);
    }

    return response.body;
};

module.exports = {
    createTestUser,
    loginTestUser,
    loginAdmin,
    createTestBook,
    app
};