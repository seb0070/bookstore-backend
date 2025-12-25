const { Comment, Review, User } = require('../models');

exports.createComment = async (userId, reviewId, data) => {
    const { content } = data;

    // 리뷰 존재 확인
    const review = await Review.findByPk(reviewId);
    if (!review) {
        const error = new Error('리뷰를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'REVIEW_NOT_FOUND';
        throw error;
    }

    const comment = await Comment.create({
        review_id: reviewId,
        user_id: userId,
        content,
        likes_count: 0
    });

    return comment;
};

exports.getReviewComments = async (reviewId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: comments, count } = await Comment.findAndCountAll({
        where: { review_id: reviewId },
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name']
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: comments,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};

exports.updateComment = async (id, userId, data) => {
    const comment = await Comment.findByPk(id);

    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'COMMENT_NOT_FOUND';
        throw error;
    }

    if (comment.user_id !== userId) {
        const error = new Error('본인의 댓글만 수정할 수 있습니다.');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
    }

    const { content } = data;
    await comment.update({ content });

    return comment;
};

exports.deleteComment = async (id, userId) => {
    const comment = await Comment.findByPk(id);

    if (!comment) {
        const error = new Error('댓글을 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'COMMENT_NOT_FOUND';
        throw error;
    }

    if (comment.user_id !== userId) {
        const error = new Error('본인의 댓글만 삭제할 수 있습니다.');
        error.status = 403;
        error.code = 'FORBIDDEN';
        throw error;
    }

    await comment.destroy();
    return true;
};

exports.getMyComments = async (userId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: comments, count } = await Comment.findAndCountAll({
        where: { user_id: userId },
        include: [{
            model: Review,
            as: 'review',
            attributes: ['id', 'content'],
            include: [{
                model: require('../models').Book,
                as: 'book',
                attributes: ['id', 'title']
            }]
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    return {
        content: comments,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};