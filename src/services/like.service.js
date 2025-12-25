const { ReviewLike, CommentLike, Review, Comment } = require('../models');

// Review Like
exports.toggleReviewLike = async (userId, reviewId) => {
    const review = await Review.findByPk(reviewId);
    if (!review) {
        const error = new Error('리뷰를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'REVIEW_NOT_FOUND';
        throw error;
    }

    const existingLike = await ReviewLike.findOne({
        where: { user_id: userId, review_id: reviewId }
    });

    if (existingLike) {
        // 좋아요 취소
        await existingLike.destroy();
        await review.update({ likes_count: Math.max(0, review.likes_count - 1) });
        return { liked: false, likes_count: review.likes_count };
    } else {
        // 좋아요 추가
        await ReviewLike.create({ user_id: userId, review_id: reviewId });
        await review.update({ likes_count: review.likes_count + 1 });
        return { liked: true, likes_count: review.likes_count + 1 };
    }
};

// Comment Like
exports.toggleCommentLike = async (userId, commentId) => {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'COMMENT_NOT_FOUND';
        throw error;
    }

    const existingLike = await CommentLike.findOne({
        where: { user_id: userId, comment_id: commentId }
    });

    if (existingLike) {
        // 좋아요 취소
        await existingLike.destroy();
        await comment.update({ likes_count: Math.max(0, comment.likes_count - 1) });
        return { liked: false, likes_count: comment.likes_count };
    } else {
        // 좋아요 추가
        await CommentLike.create({ user_id: userId, comment_id: commentId });
        await comment.update({ likes_count: comment.likes_count + 1 });
        return { liked: true, likes_count: comment.likes_count + 1 };
    }
};