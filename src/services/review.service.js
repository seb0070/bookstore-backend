const { Review, User, Book } = require('../models');

exports.createReview = async (userId, bookId, data) => {
    const { rating, content } = data;

    // 책 존재 확인
    const book = await Book.findByPk(bookId);
    if (!book || book.status === 'DELETED') {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    // 이미 리뷰 작성했는지 확인
    const existingReview = await Review.findOne({
        where: { user_id: userId, book_id: bookId }
    });

    if (existingReview) {
        const error = new Error('이미 해당 도서에 리뷰를 작성하셨습니다.');
        error.status = 409;
        error.code = 'DUPLICATE_RESOURCE';
        throw error;
    }

    const review = await Review.create({
        user_id: userId,
        book_id: bookId,
        rating,
        content,
        likes_count: 0
    });

    return review;
};

exports.getBookReviews = async (bookId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: reviews, count } = await Review.findAndCountAll({
        where: { book_id: bookId },
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: reviews,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};

exports.getReviewById = async (id) => {
    const review = await Review.findByPk(id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name']
            },
            {
                model: Book,
                as: 'book',
                attributes: ['id', 'title']
            }
        ]
    });

    if (!review) {
        const error = new Error('리뷰를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'REVIEW_NOT_FOUND';
        throw error;
    }

    return review;
};

exports.updateReview = async (id, userId, data) => {
    const review = await Review.findByPk(id);

    if (!review) {
        const error = new Error('리뷰를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'REVIEW_NOT_FOUND';
        throw error;
    }

    if (review.user_id !== userId) {
        const error = new Error('본인의 리뷰만 수정할 수 있습니다.');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
    }

    const { rating, content } = data;
    await review.update({
        rating: rating ?? review.rating,
        content: content ?? review.content
    });

    return review;
};

exports.deleteReview = async (id, userId) => {
    const review = await Review.findByPk(id);

    if (!review) {
        const error = new Error('리뷰를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'REVIEW_NOT_FOUND';
        throw error;
    }

    if (review.user_id !== userId) {
        const error = new Error('본인의 리뷰만 삭제할 수 있습니다.');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
    }

    await review.destroy();
    return true;
};

exports.getMyReviews = async (userId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: reviews, count } = await Review.findAndCountAll({
        where: { user_id: userId },
        include: [{
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'cover_image']
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: reviews,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};