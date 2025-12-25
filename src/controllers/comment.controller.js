const commentService = require('../services/comment.service');

exports.createComment = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const comment = await commentService.createComment(req.user.id, reviewId, req.body);
        res.status(201).json(comment);
    } catch (err) {
        next(err);
    }
};

exports.getReviewComments = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const comments = await commentService.getReviewComments(reviewId, req.query);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};

exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await commentService.updateComment(id, req.user.id, req.body);
        res.status(200).json(comment);
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        await commentService.deleteComment(id, req.user.id);
        res.status(200).json({ message: '댓글이 삭제되었습니다.' });
    } catch (err) {
        next(err);
    }
};

exports.getMyComments = async (req, res, next) => {
    try {
        const comments = await commentService.getMyComments(req.user.id, req.query);
        res.status(200).json(comments);
    } catch (err) {
        next(err);
    }
};