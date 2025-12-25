'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface) {
        const passwordHash = bcrypt.hashSync('P@ssw0rd!', 10);

        const users = [];

        // 관리자 1명
        users.push({
            email: 'admin@example.com',
            name: '관리자',
            password_hash: passwordHash,
            birth_date: '1990-01-01',
            gender: 'OTHER',
            address: '서울시 강남구',
            phone_number: '010-0000-0000',
            role: 'ADMIN',
            status: 'ACTIVE',
            created_at: new Date(),
            updated_at: new Date(),
        });

        // 일반 사용자 29명
        const names = [
            '김철수', '이영희', '박민수', '최지은', '정하늘',
            '강민지', '조성민', '윤서연', '임준호', '한소연',
            '오태양', '신유진', '배준서', '송지민', '홍길동',
            '권나연', '유재석', '김하늘', '이별', '박스타',
            '최고은', '정우성', '강동원', '조인성', '윤계상',
            '임시완', '한지민', '송혜교', '전지현'
        ];

        for (let i = 0; i < names.length; i++) {
            const genders = ['MALE', 'FEMALE', 'OTHER'];
            const districts = ['강남구', '서초구', '송파구', '강동구', '마포구', '용산구', '종로구', '중구'];

            users.push({
                email: `user${i + 1}@example.com`,
                name: names[i],
                password_hash: passwordHash,
                birth_date: `199${i % 10}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
                gender: genders[i % 3],
                address: `서울시 ${districts[i % districts.length]}`,
                phone_number: `010-${String(1000 + i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
                role: 'USER',
                status: 'ACTIVE',
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert('users', users);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    },
};