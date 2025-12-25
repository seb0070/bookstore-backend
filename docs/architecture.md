# 시스템 아키텍처

## 전체 구조 개요

본 프로젝트는 **3-Tier 아키텍처**를 기반으로 한 RESTful API 서버입니다.

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                      │
│              (Browser / Postman)                    │
└─────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│                Application Layer                    │
│                                                     │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Routes    │→ │Controller│→ │  Service     │   │
│  └───────────┘  └──────────┘  └──────────────┘   │
│        ▲              ▲               ▲            │
│        │              │               │            │
│  ┌─────┴──────────────┴───────────────┴────────┐  │
│  │           Middlewares                       │  │
│  │  (Auth / Validation / Error Handling)       │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│                 Data Layer                          │
│                                                     │
│  ┌──────────┐        ┌─────────────────────┐      │
│  │ Sequelize│   ←→   │      MySQL          │      │
│  │  Models  │        │   (bookstore DB)    │      │
│  └──────────┘        └─────────────────────┘      │
└─────────────────────────────────────────────────────┘
```

---

## 계층별 역할

### 1. Routes (라우팅 계층)
**위치**: `src/routes/`  
**역할**: HTTP 요청을 적절한 컨트롤러로 라우팅

```javascript
// 예: book.routes.js
router.get('/', bookController.getBooks);
router.post('/', authenticate, authorize('ADMIN'), bookController.createBook);
```

**특징**:
- URL 패턴 정의
- 미들웨어 체인 구성
- HTTP 메서드별 핸들러 매핑

---

### 2. Controllers (컨트롤러 계층)
**위치**: `src/controllers/`  
**역할**: HTTP 요청/응답 처리, 입력 검증 후 서비스 호출

```javascript
// 예: book.controller.js
const getBooks = async (req, res, next) => {
  try {
    const { page, size, keyword } = req.query;
    const result = await bookService.getBooks({ page, size, keyword });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
```

**책임**:
- 요청 파라미터 추출
- 서비스 계층 호출
- HTTP 응답 생성
- 에러 전달

---

### 3. Services (비즈니스 로직 계층)
**위치**: `src/services/`  
**역할**: 핵심 비즈니스 로직 처리

```javascript
// 예: book.service.js
const getBooks = async ({ page = 0, size = 20, keyword }) => {
  const offset = page * size;
  const whereClause = keyword ? {
    title: { [Op.like]: `%${keyword}%` }
  } : {};
  
  const { rows, count } = await Book.findAndCountAll({
    where: whereClause,
    limit: size,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    content: rows,
    page,
    size,
    totalElements: count,
    totalPages: Math.ceil(count / size)
  };
};
```

**책임**:
- 비즈니스 규칙 구현
- 데이터 변환 및 가공
- 트랜잭션 관리
- 여러 모델 조합

---

### 4. Models (데이터 접근 계층)
**위치**: `src/models/`  
**역할**: 데이터베이스 스키마 정의 및 데이터 접근

```javascript
// 예: book.js
const Book = sequelize.define('book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  // ...
});

// 관계 정의
Book.hasMany(Review, { foreignKey: 'book_id' });
```

**책임**:
- 테이블 스키마 정의
- 모델 간 관계 정의
- 데이터 검증 규칙
- Getter/Setter 정의

---

### 5. Middlewares (미들웨어 계층)
**위치**: `src/middlewares/`

#### **인증 미들웨어** (`auth.middleware.js`)
```javascript
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new UnauthorizedError();
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

#### **권한 미들웨어** (`auth.middleware.js`)
```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    }
    next();
  };
};
```

#### **검증 미들웨어** (`validate.middleware.js`)
```javascript
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) throw new ValidationError(error.details);
    next();
  };
};
```

#### **에러 핸들러** (`error.middleware.js`)
```javascript
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    timestamp: new Date().toISOString(),
    path: req.path,
    status: err.status,
    code: err.code,
    message: err.message
  });
};
```

---

## 의존성 흐름

```
Routes
  ↓ (의존)
Controllers
  ↓ (의존)
Services
  ↓ (의존)
Models
  ↓ (의존)
Database
```

**원칙**: 상위 계층은 하위 계층에만 의존, 역방향 의존 금지

---

## 모듈 구조

```
src/
├── app.js                    # Express 앱 설정
├── server.js                 # 서버 시작점
│
├── routes/                   # 라우팅 (10개)
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── book.routes.js
│   ├── order.routes.js
│   ├── review.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── wishlist.routes.js
│   ├── cart.routes.js
│   └── stats.routes.js
│
├── controllers/              # 컨트롤러 (10개)
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── book.controller.js
│   ├── order.controller.js
│   ├── review.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── wishlist.controller.js
│   ├── cart.controller.js
│   └── stats.controller.js
│
├── services/                 # 서비스 (10개)
│   ├── auth.service.js
│   ├── user.service.js
│   ├── book.service.js
│   ├── order.service.js
│   ├── review.service.js
│   ├── comment.service.js
│   ├── like.service.js
│   ├── wishlist.service.js
│   ├── cart.service.js
│   └── stats.service.js
│
├── models/                   # 모델 (13개)
│   ├── index.js              # Sequelize 초기화
│   ├── user.js
│   ├── userrefreshtoken.js
│   ├── book.js
│   ├── order.js
│   ├── orderitem.js
│   ├── review.js
│   ├── reviewlike.js
│   ├── comment.js
│   ├── commentlike.js
│   ├── wishlist.js
│   ├── cart.js
│   └── cartitem.js
│
├── middlewares/              # 미들웨어 (4개)
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
│
└── validators/               # 검증 스키마 (8개)
    ├── auth.validator.js
    ├── user.validator.js
    └── book.validator.js
```

---

## 데이터 흐름 예시

### 예: "도서 목록 조회"

```
1. HTTP Request
   GET /api/books?page=0&size=10&keyword=자바

2. Routes
   router.get('/', bookController.getBooks)

3. Controller
   - req.query 파싱
   - bookService.getBooks() 호출

4. Service
   - 페이지네이션 계산
   - Book.findAndCountAll() 호출
   - 결과 가공

5. Model (Sequelize)
   - SQL 쿼리 생성 및 실행
   - SELECT * FROM books WHERE title LIKE '%자바%' ...

6. Database
   - 쿼리 실행
   - 결과 반환

7. Response
   {
     "content": [...],
     "page": 0,
     "size": 10,
     "totalElements": 25
   }
```

---

## 보안 아키텍처

### 인증 플로우
```
1. POST /api/auth/login
   ↓
2. authService.login()
   - 비밀번호 검증 (bcrypt)
   - JWT 생성
   ↓
3. { accessToken, refreshToken }
   ↓
4. Client 저장
   ↓
5. 이후 요청에 Authorization 헤더 포함
   ↓
6. authenticate 미들웨어
   - 토큰 검증
   - req.user에 사용자 정보 저장
   ↓
7. authorize 미들웨어
   - 역할 확인
   ↓
8. Controller 실행
```

---

## 에러 처리 아키텍처

### 에러 전파 흐름
```
1. Service Layer
   throw new NotFoundError('Book not found')
   ↓
2. Controller
   catch (error) { next(error) }
   ↓
3. Error Middleware
   - 에러 타입 분석
   - HTTP 상태코드 매핑
   - JSON 응답 생성
   ↓
4. Client
   {
     "status": 404,
     "code": "RESOURCE_NOT_FOUND",
     "message": "..."
   }
```

---

## 확장 가능성

### 수평 확장
- Stateless 설계 (JWT)
- 세션 없음
- DB 커넥션 풀 관리

### 수직 확장
- 모듈별 독립성
- 계층 분리
- 의존성 주입 가능

### 마이크로서비스 전환 가능성
```
현재 모놀리식:
┌─────────────────────────┐
│   Bookstore Service     │
│  (All in One)           │
└─────────────────────────┘

향후 마이크로서비스:
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Auth    │ │  Book    │ │  Order   │
│ Service  │ │ Service  │ │ Service  │
└──────────┘ └──────────┘ └──────────┘
```

---

## 기술 스택 정리

| 계층 | 기술 |
|------|------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 5.x |
| **ORM** | Sequelize 6.x |
| **Database** | MySQL 8.0 |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | Joi |
| **Security** | bcrypt, Helmet, CORS |
| **Testing** | Jest, Supertest |
| **Process Manager** | PM2 |
| **Documentation** | Swagger (swagger-jsdoc) |
