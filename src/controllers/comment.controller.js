const reviewService = require('../services/review.service');

exports.createReview = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const review = await reviewService.createReview(req.user.id, bookId, req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};

exports.getBookReviews = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const reviews = await reviewService.getBookReviews(bookId, req.query);
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};

exports.getReviewById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewService.getReviewById(id);
        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await reviewService.updateReview(id, req.user.id, req.body);
        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        await reviewService.deleteReview(id, req.user.id);
        res.status(200).json({ message: '리뷰가 삭제되었습니다.' });
    } catch (err) {
        next(err);
    }
};

exports.getMyReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.getMyReviews(req.user.id, req.query);
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};