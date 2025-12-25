'use strict';

module.exports = {
    async up(queryInterface) {
        const books = [];

        const categories = [
            'fiction', 'non-fiction', 'science', 'history', 'philosophy',
            'economics', 'self-help', 'essay', 'poetry', 'biography'
        ];

        const publishers = [
            '민음사', '창비', '문학동네', '열린책들', '김영사',
            '위즈덤하우스', '알에이치코리아', '북하우스', 'arte', '21세기북스'
        ];

        const bookTitles = [
            '코스모스', '사피엔스', '총, 균, 쇠', '이기적 유전자', '정의란 무엇인가',
            '미움받을 용기', '데미안', '1984', '채식주의자', '82년생 김지영',
            '아몬드', '달러구트 꿈 백화점', '죽은 왕의 딸', '트렌드 코리아 2024', '공정하다는 착각',
            '역사의 쓸모', '어떻게 살 것인가', '완벽한 공부법', '돈의 심리학', '부의 추월차선',
            '나는 누구인가', '명상록', '도덕경', '논어', '맹자',
            '노인과 바다', '햄릿', '파우스트', '변신', '이방인',
            '백년 동안의 고독', '호밀밭의 파수꾼', '위대한 개츠비', '오만과 편견', '폭풍의 언덕',
            '제인 에어', '레미제라블', '몬테크리스토 백작', '삼총사', '80일간의 세계일주',
            '해저 2만리', '셜록 홈즈', '오리엔트 특급 살인', '그리고 아무도 없었다', '나일 강의 죽음',
            '살인 십계명', '파리 대왕', '동물농장', '멋진 신세계', '화씨 451',
            '시계태엽 오렌지', '태양은 가득히', '그리스인 조르바', '카라마조프가의 형제들', '죄와 벌',
            '전쟁과 평화', '안나 카레니나', '부활', '아버지와 아들', '오블로모프',
            '체리 동산', '갈매기', '삼촌 바냐', '벚나무 동산', '지하로부터의 수기',
            '백치', '악령', '백경', '주홍 글씨', '허클베리 핀의 모험',
            '톰 소여의 모험', '젊은 예술가의 초상', '율리시스', '더블린 사람들', '피네건의 경야',
            '수레바퀴 아래서', '황무지', '시다르타', '나르치스와 골드문트', '유리알 유희',
            '데미안', '황야의 이리', '크눌프', '페터 카멘친트', '로스할데',
            '클라인과 바그너', '계단', '인간 실격', '이슬람의 이해', '논어',
            '맹자', '대학', '중용', '삼국지', '수호지',
            '홍루몽', '서유기', '손자병법', '한비자', '묵자'
        ];

        for (let i = 0; i < 100; i++) {
            const authorCount = (i % 3) + 1;
            const authors = [];
            for (let j = 0; j < authorCount; j++) {
                authors.push(`저자${i}_${j + 1}`);
            }

            const catCount = (i % 3) + 1;
            const bookCats = [];
            for (let k = 0; k < catCount; k++) {
                bookCats.push(categories[(i + k) % categories.length]);
            }

            books.push({
                title: bookTitles[i] || `테스트 도서 ${i + 1}`,
                description: `${bookTitles[i] || `테스트 도서 ${i + 1}`}에 대한 상세 설명입니다. 이 책은 ${bookCats.join(', ')} 분야의 명저로 평가받고 있습니다.`,
                isbn: `978-89-${String(i).padStart(4, '0')}-${String(i * 3).padStart(3, '0')}-${i % 10}`,
                authors: JSON.stringify(authors), // JSON 문자열로 변환!
                categories: JSON.stringify(bookCats), // JSON 문자열로 변환!
                publisher: publishers[i % publishers.length],
                published_year: 2000 + (i % 25),
                price: (10000 + (i * 500)) % 50000,
                stock_quantity: 10 + (i % 50),
                cover_image: `https://picsum.photos/seed/book${i}/400/600`, // 커버 이미지 추가!
                status: 'ACTIVE',
                created_by: 1, // admin 계정
                created_at: new Date(),
                updated_at: new Date(),
            });
        }

        await queryInterface.bulkInsert('books', books);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('books', null, {});
    },
};