# 📚 Bookstore Backend API

온라인 서점 백엔드 REST API - 웹서비스설계 2분반 과제2

---

## 프로젝트 개요

### 문제 정의
현대의 온라인 서점은 단순한 도서 판매를 넘어 사용자 리뷰, 커뮤니티 기능, 개인화된 추천 등 다양한 기능을 제공해야 합니다. 본 프로젝트는 이러한 요구사항을 충족하는 확장 가능한 RESTful API 서버를 구축하는 것을 목표로 합니다.

### 주요 기능 목록
- **사용자 관리**: 회원가입, 로그인, JWT 기반 인증/인가
- **도서 관리**: CRUD, 검색, 정렬, 페이지네이션
- **주문 시스템**: 장바구니, 주문 생성/조회, 재고 관리
- **리뷰 & 댓글**: 도서 리뷰 작성, 댓글, 좋아요 기능
- **위시리스트**: 관심 도서 저장 및 관리
- **통계 기능**: 도서/사용자/주문 통계 (관리자 전용)
- **역할 기반 접근 제어**: USER/ADMIN 권한 분리

---

## 배포 주소

### JCloud 배포 환경
- **Base URL**: `http://113.198.66.68:13201`
- **Health Check**: `http://113.198.66.68:13201/health`
- **API Root**: `http://113.198.66.68:13201/api`

### Swagger 제한사항
배포 서버는 HTTP 프로토콜을 사용하여 Swagger UI가 Mixed Content 보안 정책으로 인해 정상 작동하지 않습니다.

- **로컬 환경**: `http://localhost:3000/docs` (정상 작동)
- **배포 환경**: ❌ (HTTP/HTTPS 혼합 콘텐츠 제약)
- **대안**: Postman Collection 사용 권장 (`/postman/bookstore-api.postman_collection.json`)

---

## 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/seb0070/bookstore-backend.git
cd bookstore-backend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.example` 파일을 참고하여 `.env` 파일 생성:
```bash
cp .env.example .env
```

`.env` 파일 수정:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=bookstore

# JWT (최소 32자 이상의 안전한 랜덤 문자열 사용)
JWT_SECRET=your_super_secure_jwt_secret_key_min_32_characters
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_min_32_chars
REFRESH_TOKEN_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

### 4. 데이터베이스 설정
```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 마이그레이션 실행
npm run migrate

# 시드 데이터 생성 (380+ 레코드)
npm run seed
```

### 5. 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

### 6. 테스트 실행
```bash
npm test
```

서버 실행 확인:
```
http://localhost:3000/health
```

---

## 환경 변수 설명

| 변수명 | 설명 | 예시 | 필수 |
|--------|------|------|------|
| `DB_HOST` | MySQL 호스트 주소 | `localhost` | ✅ |
| `DB_PORT` | MySQL 포트 | `3306` | ✅ |
| `DB_USER` | MySQL 사용자명 | `root` | ✅ |
| `DB_PASSWORD` | MySQL 비밀번호 | `your_password` | ✅ |
| `DB_NAME` | 데이터베이스 이름 | `bookstore` | ✅ |
| `JWT_SECRET` | JWT Access Token 비밀키 (최소 32자) | `min_32_characters_secret` | ✅ |
| `JWT_EXPIRES_IN` | Access Token 만료 시간 | `15m` | ✅ |
| `REFRESH_TOKEN_SECRET` | Refresh Token 비밀키 (최소 32자) | `min_32_characters_secret` | ✅ |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh Token 만료 시간 | `7d` | ✅ |
| `PORT` | 서버 포트 | `3000` | ❌ |
| `NODE_ENV` | 실행 환경 | `development`, `production`, `test` | ❌ |

---

## API 테스트 방법

### Postman 사용 (권장)

#### 1. Collection Import
1. Postman 열기
2. **Import** 클릭
3. `postman/bookstore-api.postman_collection.json` 선택
4. Import 완료

#### 2. Environment 설정
- **Variable**: `baseUrl`
- **Value**: `http://113.198.66.68:13201` (배포) 또는 `http://localhost:3000` (로컬)

#### 3. 주요 테스트 시나리오

**A. 회원가입 & 로그인**
```
1. POST /api/auth/signup - 회원가입
2. POST /api/auth/login - 로그인 → accessToken 저장
3. GET /api/users/me - 내 정보 조회 (Bearer Token 필요)
```

**B. 도서 검색 & 주문**
```
1. GET /api/books - 도서 목록
2. GET /api/books?keyword=자바&page=0&size=5 - 검색
3. POST /api/cart - 장바구니 추가
4. POST /api/orders - 주문 생성
```

**C. 리뷰 작성**
```
1. POST /api/books/1/reviews - 리뷰 작성
2. POST /api/reviews/1/like - 좋아요
3. POST /api/reviews/1/comments - 댓글 작성
```

**D. 관리자 기능 (ADMIN 계정 필요)**
```
1. POST /api/books - 도서 생성
2. GET /api/stats/books - 도서 통계
3. GET /api/orders - 전체 주문 조회
```

### cURL 테스트 예시

**Health Check**
```bash
curl http://113.198.66.68:13201/health
```

**도서 목록 조회**
```bash
curl http://113.198.66.68:13201/api/books
```

**회원가입**
```bash
curl -X POST http://113.198.66.68:13201/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "Test1234!@",
    "name": "테스트유저",
    "gender": "MALE"
  }'
```

**로그인**
```bash
curl -X POST http://113.198.66.68:13201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "User1234!@"
  }'
```

---

## 예제 계정

### 일반 사용자 (USER)
| Email | Password | 설명 |
|-------|----------|------|
| `user1@example.com` | `User1234!@` | 테스트용 일반 사용자 1 |
| `user2@example.com` | `User1234!@` | 테스트용 일반 사용자 2 |
| `user3@example.com` | `User1234!@` | 테스트용 일반 사용자 3 |

### 관리자 (ADMIN)
| Email | Password | 설명 |
|-------|----------|------|
| `admin1@example.com` | `Admin1234!@` | 관리자 계정 1 |
| `admin2@example.com` | `Admin1234!@` | 관리자 계정 2 |

**주의**: 프로덕션 환경에서는 반드시 비밀번호를 변경하세요.

---

## 데이터베이스 정보

### 연결 정보 (테스트용)
```
Host: localhost (서버 내부)
Port: 3306
Database: bookstore
Username: root
Password: (제출용 별도 문서 참고)
```

**보안**: DB 비밀번호는 제출용 문서에만 기재 (GitHub 공개 불가)

### 접속 명령어
```bash
# 서버 SSH 접속 후
mysql -u root -p
# 비밀번호 입력 후 데이터베이스 선택
USE bookstore;

# 데이터베이스 확인
SHOW TABLES;
SELECT COUNT(*) FROM users;    # 20개
SELECT COUNT(*) FROM books;    # 100개
SELECT COUNT(*) FROM orders;   # 50개
SELECT COUNT(*) FROM reviews;  # 150개
```

### 테이블 목록
- `users` - 사용자 (20건)
- `user_refresh_tokens` - 리프레시 토큰
- `books` - 도서 (100건)
- `orders` - 주문 (50건)
- `order_items` - 주문 상품 (100건)
- `reviews` - 리뷰 (150건)
- `review_likes` - 리뷰 좋아요 (60건)
- `comments` - 댓글 (50건)
- `comment_likes` - 댓글 좋아요 (20건)
- `wishlists` - 위시리스트 (30건)
- `carts` - 장바구니 (10건)
- `cart_items` - 장바구니 항목 (20건)

**총 시드 데이터: 380+ 레코드**

---

## 🔐 인증 플로우

### 1. 회원가입 & 로그인
```
┌─────────────┐
│ 회원가입     │ POST /api/auth/signup
│ (비밀번호    │ → bcrypt 해싱 → DB 저장
│  해싱)       │
└─────────────┘
       ↓
┌─────────────┐
│ 로그인       │ POST /api/auth/login
│             │ → 비밀번호 검증
│             │ → JWT 발급
└─────────────┘
       ↓
{
  "accessToken": "eyJhbGc...",    // 15분
  "refreshToken": "eyJhbGc..."    // 7일
}
```

### 2. API 요청 (인증 필요)
```
Authorization: Bearer {accessToken}
       ↓
┌──────────────────┐
│ authenticate     │ 미들웨어
│ 미들웨어          │ → 토큰 검증
│                  │ → req.user 설정
└──────────────────┘
       ↓
┌──────────────────┐
│ authorize        │ 미들웨어
│ 미들웨어          │ → 역할 확인
│                  │   (USER/ADMIN)
└──────────────────┘
       ↓
   Controller 실행
```

### 3. Token 갱신
```
POST /api/auth/refresh
Body: { "refreshToken": "..." }
       ↓
새로운 accessToken + refreshToken 발급
```

### 4. 로그아웃
```
POST /api/auth/logout
Authorization: Bearer {accessToken}
       ↓
Refresh Token DB에서 삭제
```

---

## 👥 역할 및 권한

### USER (일반 사용자)
**가능한 작업:**
- ✅ 회원가입, 로그인, 로그아웃
- ✅ 도서 조회, 검색
- ✅ 리뷰 작성, 수정, 삭제
- ✅ 댓글 작성, 수정, 삭제
- ✅ 좋아요 추가/취소
- ✅ 주문 생성, 조회, 취소
- ✅ 장바구니 관리
- ✅ 위시리스트 관리
- ✅ 자신의 정보 수정

**불가능한 작업:**
- ❌ 도서 생성/수정/삭제
- ❌ 다른 사용자 정보 조회
- ❌ 전체 주문 조회
- ❌ 통계 조회

### ADMIN (관리자)
**USER의 모든 권한 + 추가 권한:**
- ✅ 도서 CRUD
- ✅ 모든 사용자 조회
- ✅ 사용자 정보 수정
- ✅ 사용자 활성화/비활성화
- ✅ 모든 주문 조회
- ✅ 주문 상태 변경
- ✅ 통계 조회 (도서/사용자/주문)

### 권한별 엔드포인트 매트릭스

| 기능 | 엔드포인트 | USER | ADMIN |
|------|-----------|------|-------|
| 도서 조회 | `GET /api/books` | ✅ | ✅ |
| 도서 생성 | `POST /api/books` | ❌ | ✅ |
| 도서 수정 | `PATCH /api/books/:id` | ❌ | ✅ |
| 도서 삭제 | `DELETE /api/books/:id` | ❌ | ✅ |
| 내 정보 조회 | `GET /api/users/me` | ✅ | ✅ |
| 전체 사용자 조회 | `GET /api/users` | ❌ | ✅ |
| 내 주문 조회 | `GET /api/orders/me` | ✅ | ✅ |
| 전체 주문 조회 | `GET /api/orders` | ❌ | ✅ |
| 통계 조회 | `GET /api/stats/*` | ❌ | ✅ |

---

## 📋 엔드포인트 목록 (총 47개)

### 인증 (Auth) - 4개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| POST | `/api/auth/signup` | 회원가입 | ❌ | - |
| POST | `/api/auth/login` | 로그인 | ❌ | - |
| POST | `/api/auth/refresh` | 토큰 갱신 | ❌ | - |
| POST | `/api/auth/logout` | 로그아웃 | ✅ | USER |

### 사용자 (Users) - 5개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| GET | `/api/users/me` | 내 정보 조회 | ✅ | USER |
| PATCH | `/api/users/me` | 내 정보 수정 | ✅ | USER |
| DELETE | `/api/users/me` | 회원 탈퇴 | ✅ | USER |
| GET | `/api/users` | 전체 사용자 조회 | ✅ | ADMIN |
| GET | `/api/users/:id` | 특정 사용자 조회 | ✅ | ADMIN |

### 도서 (Books) - 6개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| GET | `/api/books` | 도서 목록 (검색/정렬/페이징) | ❌ | - |
| GET | `/api/books/:id` | 도서 상세 조회 | ❌ | - |
| POST | `/api/books` | 도서 생성 | ✅ | ADMIN |
| PATCH | `/api/books/:id` | 도서 수정 | ✅ | ADMIN |
| DELETE | `/api/books/:id` | 도서 삭제 | ✅ | ADMIN |
| GET | `/api/books/:id/reviews` | 도서별 리뷰 목록 | ❌ | - |

### 주문 (Orders) - 6개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| POST | `/api/orders` | 주문 생성 | ✅ | USER |
| GET | `/api/orders/me` | 내 주문 목록 | ✅ | USER |
| GET | `/api/orders/:id` | 주문 상세 조회 | ✅ | USER |
| PATCH | `/api/orders/:id/cancel` | 주문 취소 | ✅ | USER |
| GET | `/api/orders` | 전체 주문 조회 | ✅ | ADMIN |
| PATCH | `/api/orders/:id/status` | 주문 상태 변경 | ✅ | ADMIN |

### 리뷰 (Reviews) - 7개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| POST | `/api/books/:bookId/reviews` | 리뷰 작성 | ✅ | USER |
| GET | `/api/reviews/:id` | 리뷰 상세 조회 | ❌ | - |
| PATCH | `/api/reviews/:id` | 리뷰 수정 | ✅ | USER |
| DELETE | `/api/reviews/:id` | 리뷰 삭제 | ✅ | USER |
| POST | `/api/reviews/:id/like` | 리뷰 좋아요 | ✅ | USER |
| DELETE | `/api/reviews/:id/like` | 리뷰 좋아요 취소 | ✅ | USER |
| GET | `/api/reviews/:id/comments` | 리뷰 댓글 목록 | ❌ | - |

### 댓글 (Comments) - 6개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| POST | `/api/reviews/:reviewId/comments` | 댓글 작성 | ✅ | USER |
| GET | `/api/comments/:id` | 댓글 상세 조회 | ❌ | - |
| PATCH | `/api/comments/:id` | 댓글 수정 | ✅ | USER |
| DELETE | `/api/comments/:id` | 댓글 삭제 | ✅ | USER |
| POST | `/api/comments/:id/like` | 댓글 좋아요 | ✅ | USER |
| DELETE | `/api/comments/:id/like` | 댓글 좋아요 취소 | ✅ | USER |

### 위시리스트 (Wishlist) - 4개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| GET | `/api/wishlist` | 위시리스트 조회 | ✅ | USER |
| POST | `/api/wishlist` | 위시리스트 추가 | ✅ | USER |
| DELETE | `/api/wishlist/:id` | 위시리스트 항목 삭제 | ✅ | USER |
| DELETE | `/api/wishlist` | 위시리스트 전체 삭제 | ✅ | USER |

### 장바구니 (Cart) - 6개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| GET | `/api/cart` | 장바구니 조회 | ✅ | USER |
| POST | `/api/cart` | 장바구니 추가 | ✅ | USER |
| PATCH | `/api/cart/:id` | 장바구니 수량 변경 | ✅ | USER |
| DELETE | `/api/cart/:id` | 장바구니 항목 삭제 | ✅ | USER |
| DELETE | `/api/cart` | 장바구니 전체 삭제 | ✅ | USER |
| POST | `/api/cart/checkout` | 장바구니 결제 | ✅ | USER |

### 통계 (Stats) - 3개
| Method | URL | 설명 | 인증 | 권한 |
|--------|-----|------|------|------|
| GET | `/api/stats/books` | 도서 통계 | ✅ | ADMIN |
| GET | `/api/stats/users` | 사용자 통계 | ✅ | ADMIN |
| GET | `/api/stats/orders` | 주문 통계 | ✅ | ADMIN |

---

## 검색/정렬/페이지네이션

### 도서 검색 예시
```
GET /api/books?keyword=자바&page=0&size=10&sort=createdAt,DESC
```

**쿼리 파라미터:**
- `keyword`: 검색어 (제목 검색)
- `page`: 페이지 번호 (0부터 시작)
- `size`: 페이지 크기 (기본 20, 최대 100)
- `sort`: 정렬 (필드명,방향)
    - 예: `createdAt,DESC`, `price,ASC`, `title,ASC`

**응답 형식:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "자바의 정석",
      "price": 30000,
      ...
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 25,
  "totalPages": 3,
  "sort": "createdAt,DESC"
}
```

---

## 성능 및 보안

### 보안
- **비밀번호 해싱**: bcrypt (salt rounds: 10)
- **JWT 알고리즘**: HS256
- **토큰 만료**: Access Token 15분, Refresh Token 7일
- **입력 검증**: Joi 스키마 검증
- **보안 헤더**: Helmet 미들웨어
- **CORS**: 허용 도메인 설정
- **환경 변수**: 민감 정보 .env 분리

### 성능
- **데이터베이스 인덱스**: email, isbn, created_at 등 주요 필드
- **N+1 쿼리 방지**: Sequelize eager loading 활용
- **페이지네이션**: 모든 목록 조회 API 적용
- **JSON 타입**: authors, categories 배열 효율적 저장

### 에러 처리
모든 에러는 일관된 JSON 형식으로 응답:

```json
{
  "timestamp": "2025-12-26T12:00:00Z",
  "path": "/api/books/999",
  "status": 404,
  "code": "RESOURCE_NOT_FOUND",
  "message": "요청한 리소스를 찾을 수 없습니다.",
  "details": null
}
```

**주요 에러 코드:**
| HTTP | 코드 | 설명 |
|------|------|------|
| 400 | `BAD_REQUEST` | 잘못된 요청 형식 |
| 400 | `VALIDATION_FAILED` | 입력 검증 실패 |
| 401 | `UNAUTHORIZED` | 인증 토큰 없음/만료 |
| 401 | `TOKEN_EXPIRED` | 토큰 만료 |
| 403 | `FORBIDDEN` | 권한 부족 |
| 404 | `RESOURCE_NOT_FOUND` | 리소스 없음 |
| 409 | `DUPLICATE_EMAIL` | 이메일 중복 |
| 422 | `UNPROCESSABLE_ENTITY` | 처리 불가능한 요청 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

---

## 테스트

### 자동화 테스트 (20개)
```bash
npm test
```

**테스트 결과:**
```
Test Suites: 4 passed, 4 total
Tests:       20 passed, 20 total
Coverage:    ~37%
Time:        ~10s
```

**테스트 범위:**
- **Auth 테스트 (7개)**
    - ✅ 회원가입 성공
    - ✅ 중복 이메일 회원가입 실패
    - ✅ 로그인 성공
    - ✅ 잘못된 비밀번호 로그인 실패
    - ✅ 로그아웃 성공
    - ✅ 인증된 사용자 접근
    - ✅ 인증되지 않은 사용자 차단

- **Book 테스트 (6개)**
    - ✅ 도서 목록 조회
    - ✅ 도서 상세 조회
    - ✅ 도서 검색 및 페이징
    - ✅ 관리자 도서 생성 성공
    - ✅ 일반 사용자 도서 생성 실패 (권한)
    - ✅ 도서 삭제 (관리자)

- **User 테스트 (4개)**
    - ✅ 내 정보 조회
    - ✅ 내 정보 수정
    - ✅ 회원 탈퇴
    - ✅ 관리자 전체 사용자 조회

- **Order 테스트 (3개)**
    - ✅ 주문 생성
    - ✅ 내 주문 조회
    - ✅ 다른 사용자 주문 조회 실패

---

## 📁 프로젝트 구조

```
bookstore-backend/
├── .sequelizerc              # Sequelize CLI 설정
├── config/
│   └── config.js             # DB 설정 (환경변수 기반)
├── docs/
│   ├── swagger.js            # Swagger 설정
│   ├── api-design.md         # API 설계 문서
│   └── architecture.md       # 아키텍처 문서
├── migrations/               # DB 마이그레이션 (13개)
│   ├── 01-create-user.js
│   ├── 02-create-book.js
│   └── ...
├── seeders/                  # 시드 데이터 (5개)
│   ├── 01-users.js           # 20명
│   ├── 02-books.js           # 100권
│   ├── 03-reviews.js         # 150개
│   ├── 04-comments.js        # 50개
│   └── 05-orders-carts-wishlists.js
├── postman/
│   └── bookstore-api.postman_collection.json
├── src/
│   ├── app.js               # Express 앱 설정
│   ├── server.js            # 서버 시작점
│   ├── controllers/         # 컨트롤러 (10개)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── book.controller.js
│   │   ├── order.controller.js
│   │   ├── review.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── cart.controller.js
│   │   └── stats.controller.js
│   ├── services/            # 비즈니스 로직 (10개)
│   │   └── (동일 구조)
│   ├── routes/              # 라우트 정의 (10개)
│   │   └── (동일 구조)
│   ├── models/              # Sequelize 모델 (13개)
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── userrefreshtoken.js
│   │   ├── book.js
│   │   ├── order.js
│   │   ├── orderitem.js
│   │   ├── review.js
│   │   ├── reviewlike.js
│   │   ├── comment.js
│   │   ├── commentlike.js
│   │   ├── wishlist.js
│   │   ├── cart.js
│   │   └── cartitem.js
│   ├── middlewares/         # 미들웨어 (4개)
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── error.middleware.js
│   │   └── notFound.middleware.js
│   └── validators/          # 입력 검증 (8개)
│       ├── auth.validator.js
│       ├── user.validator.js
│       ├── book.validator.js
│       └── ...
├── tests/                   # 자동화 테스트
│   ├── helpers.js
│   ├── auth.test.js
│   ├── book.test.js
│   ├── user.test.js
│   └── order.test.js
├── .env.example             # 환경변수 템플릿
├── .gitignore
├── package.json
├── jest.config.js
└── README.md
```

---

## 데이터베이스 스키마

### ERD 개요
- **13개 테이블**
- **380+ 시드 레코드**
- **외래키 제약조건**: 데이터 무결성 보장
- **인덱스 최적화**: 검색/조인 성능 향상

### 주요 테이블

#### Users (사용자)
```sql
- id (PK)
- email (UNIQUE, INDEX)
- password_hash
- name
- role (ENUM: USER, ADMIN)
- gender (ENUM: MALE, FEMALE, OTHER)
- phone, address, birth_date
- is_active (DEFAULT TRUE)
- last_login_at
- created_at, updated_at, deleted_at
```

#### Books (도서)
```sql
- id (PK)
- title (INDEX)
- description (TEXT)
- authors (JSON)
- categories (JSON)
- publisher
- isbn (UNIQUE, INDEX)
- price
- published_year
- stock_quantity
- pages
- cover_image
- language
- created_at, updated_at, deleted_at
```

#### Orders (주문)
```sql
- id (PK)
- user_id (FK → Users, INDEX)
- total_amount
- status (ENUM: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- delivery_address
- recipient_name
- recipient_phone
- created_at, updated_at
```

#### Reviews (리뷰)
```sql
- id (PK)
- book_id (FK → Books, INDEX)
- user_id (FK → Users, INDEX)
- rating (1-5)
- content (TEXT)
- created_at, updated_at, deleted_at
```

### 관계도
```
User ─┬─ UserRefreshToken (1:1)
      ├─ Order (1:N)
      ├─ Review (1:N)
      ├─ Comment (1:N)
      ├─ ReviewLike (1:N)
      ├─ CommentLike (1:N)
      ├─ Wishlist (1:N)
      └─ Cart (1:1) ─ CartItem (1:N)

Book ─┬─ OrderItem (1:N)
      ├─ Review (1:N)
      └─ Wishlist (1:N)

Order ─ OrderItem (1:N)

Review ─┬─ Comment (1:N)
        └─ ReviewLike (1:N)

Comment ─ CommentLike (1:N)
```

---

## 현재 한계점

### 기능적 한계
- **파일 업로드 미지원**: 도서 커버 이미지는 URL만 저장
- **실시간 알림 없음**: WebSocket 미구현
- **검색 기능 제한**: 기본 LIKE 검색만 지원
- **캐싱 없음**: Redis 등 캐싱 레이어 부재
- **Rate Limiting 미구현**: API 호출 제한 없음

### 기술적 한계
- **단일 서버**: 수평 확장 불가
- **로그 관리**: 중앙화된 로그 시스템 부재
- **모니터링**: APM 도구 미연동
- **Swagger 배포 제한**: HTTP 환경에서 Mixed Content 문제

---

## 📈 개선 계획

### 단기 (1-2주)
- [ ] Rate Limiting 구현 (express-rate-limit)
- [ ] Redis 캐싱 도입 (인기 도서, 카테고리)
- [ ] HTTPS 적용 (Let's Encrypt)

### 중기 (1-2개월)
- [ ] 파일 업로드 기능 (AWS S3 연동)
- [ ] Full-text search (Elasticsearch)
- [ ] 이메일 인증 (nodemailer)
- [ ] 주문 상태 변경 알림

### 장기 (3개월+)
- [ ] WebSocket 실시간 알림
- [ ] 추천 시스템 (협업 필터링)
- [ ] 결제 시스템 연동 (PG사 API)
- [ ] 마이크로서비스 아키텍처 전환

---

## 📝 package.json 스크립트

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "cross-env NODE_ENV=test jest --coverage --detectOpenHandles",
    "migrate": "npx sequelize-cli db:migrate",
    "migrate:undo": "npx sequelize-cli db:migrate:undo",
    "seed": "npx sequelize-cli db:seed:all",
    "seed:undo": "npx sequelize-cli db:seed:undo:all"
  }
}
```

---

## 🛠️ 기술 스택

| 분류 | 기술 | 버전 |
|------|------|------|
| **Runtime** | Node.js | 18+ |
| **Framework** | Express.js | 5.x |
| **Database** | MySQL | 8.0 |
| **ORM** | Sequelize | 6.x |
| **Authentication** | jsonwebtoken | 9.x |
| **Password Hashing** | bcrypt | 5.x |
| **Validation** | Joi | 17.x |
| **Security** | Helmet, CORS | - |
| **Testing** | Jest, Supertest | - |
| **Documentation** | Swagger (swagger-jsdoc, swagger-ui-express) | - |
| **Process Manager** | PM2 | - |
| **Version Control** | Git, GitHub | - |

---



## 문제 해결

### 서버 상태 확인
```bash
# PM2 프로세스 상태
pm2 status

# 서버 로그
pm2 logs bookstore

# 서버 재시작
pm2 restart bookstore
```

### 일반적인 문제 해결

**1. 서버 접속 안 됨**
```bash
# Health Check
curl http://113.198.66.68:13201/health

# PM2 상태 확인
pm2 status

# 서버 재시작
pm2 restart bookstore
```

**2. 데이터베이스 연결 오류**
```bash
# MySQL 서비스 확인
sudo systemctl status mysql

# 데이터베이스 존재 확인
mysql -u root -p
SHOW DATABASES;
```

**3. 테스트 실패**
```bash
# 테스트 DB 재생성
npx sequelize-cli db:drop
npx sequelize-cli db:create
npx sequelize-cli db:migrate

# 테스트 재실행
npm test
```
