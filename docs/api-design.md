# API 설계 문서

## 과제 1 API 설계 반영 및 수정사항

### 설계 개요
본 프로젝트는 과제 1에서 설계한 온라인 서점 API를 기반으로 구현되었습니다.

---

## 주요 변경사항

### 1. 엔드포인트 확장
**과제 1 설계**: 기본 CRUD 위주 (약 30개)  
**과제 2 구현**: 47개 엔드포인트로 확장

**추가된 기능:**
- 리뷰/댓글 좋아요 기능
- 장바구니 체크아웃
- 통계 API (관리자 전용)
- 토큰 갱신 API

### 2. 인증/인가 강화
**과제 1**: JWT 기본 구조만 설계  
**과제 2**: 
- Access Token (15분) + Refresh Token (7일)
- Role 기반 권한 제어 (USER/ADMIN)
- 토큰 만료/갱신 처리

### 3. 페이지네이션 표준화
**과제 1**: 간단한 page/size만 고려  
**과제 2**: 
```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 153,
  "totalPages": 8,
  "sort": "createdAt,DESC"
}
```

### 4. 에러 응답 규격 통일
**과제 1**: 기본 HTTP 상태코드만 사용  
**과제 2**: 
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

---

## API 엔드포인트 분류

### 인증 (Auth) - 4개
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 사용자 (Users) - 5개
- `GET /api/users/me` - 내 정보 조회
- `PATCH /api/users/me` - 내 정보 수정
- `DELETE /api/users/me` - 회원 탈퇴
- `GET /api/users` - 전체 사용자 조회 (ADMIN)
- `GET /api/users/:id` - 특정 사용자 조회 (ADMIN)

### 도서 (Books) - 6개
- `GET /api/books` - 도서 목록 (검색/정렬/페이징)
- `GET /api/books/:id` - 도서 상세
- `POST /api/books` - 도서 생성 (ADMIN)
- `PATCH /api/books/:id` - 도서 수정 (ADMIN)
- `DELETE /api/books/:id` - 도서 삭제 (ADMIN)
- `GET /api/books/:id/reviews` - 도서별 리뷰

### 주문 (Orders) - 6개
- `POST /api/orders` - 주문 생성
- `GET /api/orders/me` - 내 주문 목록
- `GET /api/orders/:id` - 주문 상세
- `PATCH /api/orders/:id/cancel` - 주문 취소
- `GET /api/orders` - 전체 주문 (ADMIN)
- `PATCH /api/orders/:id/status` - 주문 상태 변경 (ADMIN)

### 리뷰 (Reviews) - 7개
- `POST /api/books/:bookId/reviews` - 리뷰 작성
- `GET /api/reviews/:id` - 리뷰 조회
- `PATCH /api/reviews/:id` - 리뷰 수정
- `DELETE /api/reviews/:id` - 리뷰 삭제
- `POST /api/reviews/:id/like` - 좋아요
- `DELETE /api/reviews/:id/like` - 좋아요 취소
- `GET /api/reviews/:id/comments` - 리뷰 댓글 조회

### 댓글 (Comments) - 6개
- `POST /api/reviews/:reviewId/comments` - 댓글 작성
- `GET /api/comments/:id` - 댓글 조회
- `PATCH /api/comments/:id` - 댓글 수정
- `DELETE /api/comments/:id` - 댓글 삭제
- `POST /api/comments/:id/like` - 좋아요
- `DELETE /api/comments/:id/like` - 좋아요 취소

### 위시리스트 (Wishlist) - 4개
- `GET /api/wishlist` - 조회
- `POST /api/wishlist` - 추가
- `DELETE /api/wishlist/:id` - 삭제
- `DELETE /api/wishlist` - 전체 삭제

### 장바구니 (Cart) - 6개
- `GET /api/cart` - 조회
- `POST /api/cart` - 추가
- `PATCH /api/cart/:id` - 수량 변경
- `DELETE /api/cart/:id` - 항목 삭제
- `DELETE /api/cart` - 전체 삭제
- `POST /api/cart/checkout` - 결제

### 통계 (Stats) - 3개
- `GET /api/stats/books` - 도서 통계 (ADMIN)
- `GET /api/stats/users` - 사용자 통계 (ADMIN)
- `GET /api/stats/orders` - 주문 통계 (ADMIN)

---

## 설계 검증

### 요구사항 충족도
- ✅ 최소 4개 리소스: 13개 구현
- ✅ 최소 30개 엔드포인트: 47개 구현
- ✅ CRUD 완성도: 모든 리소스 CRUD 구현
- ✅ JWT 인증: Access + Refresh Token
- ✅ RBAC: USER/ADMIN 2개 역할
- ✅ 페이지네이션: 표준 형식 적용
- ✅ 에러 처리: 통일된 JSON 형식

---

## 개선된 사항

### 보안
- 비밀번호 bcrypt 해싱 (salt rounds: 10)
- JWT HS256 알고리즘
- Joi 입력 검증
- Helmet 보안 헤더

### 성능
- 데이터베이스 인덱스 최적화
- Sequelize eager loading (N+1 방지)
- 페이지네이션 기본 적용

### 확장성
- 모듈화된 구조 (MVC 패턴)
- 환경변수 분리 (.env)
- 에러 미들웨어 중앙화
