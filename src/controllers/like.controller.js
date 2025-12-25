const likeService = require('../services/like.service');

exports.toggleReviewLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await likeService.toggleReviewLike(req.user.id, id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.toggleCommentLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await likeService.toggleCommentLike(req.user.id, id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = exports;