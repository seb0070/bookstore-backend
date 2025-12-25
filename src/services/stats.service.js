const { Book, User, Order, Review, sequelize } = require('../models');

exports.getBookStats = async () => {
    const totalBooks = await Book.count({ where: { status: 'ACTIVE' } });
    const totalStock = await Book.sum('stock_quantity', { where: { status: 'ACTIVE' } });

    const topBooks = await Review.findAll({
        attributes: [
            'book_id',
            [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'review_count']
        ],
        group: ['book_id'],
        order: [[sequelize.literal('avg_rating'), 'DESC']],
        limit: 10,
        include: [{
            model: Book,
            as: 'book',
            attributes: ['id', 'title', 'price']
        }]
    });

    return {
        totalBooks,
        totalStock,
        topBooks: topBooks.map(item => ({
            book: item.book,
            avgRating: parseFloat(item.dataValues.avg_rating).toFixed(2),
            reviewCount: parseInt(item.dataValues.review_count)
        }))
    };
};

exports.getUserStats = async () => {
    const totalUsers = await User.count({ where: { status: 'ACTIVE' } });
    const activeUsers = await User.count({ where: { status: 'ACTIVE', role: 'USER' } });
    const adminUsers = await User.count({ where: { status: 'ACTIVE', role: 'ADMIN' } });
    const blockedUsers = await User.count({ where: { status: 'BLOCKED' } });

    const topReviewers = await Review.findAll({
        attributes: [
            'user_id',
            [sequelize.fn('COUNT', sequelize.col('id')), 'review_count']
        ],
        group: ['user_id'],
        order: [[sequelize.literal('review_count'), 'DESC']],
        limit: 10,
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }]
    });

    return {
        totalUsers,
        activeUsers,
        adminUsers,
        blockedUsers,
        topReviewers: topReviewers.map(item => ({
            user: item.user,
            reviewCount: parseInt(item.dataValues.review_count)
        }))
    };
};

exports.getOrderStats = async () => {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'PENDING' } });
    const paidOrders = await Order.count({ where: { status: 'PAID' } });
    const cancelledOrders = await Order.count({ where: { status: 'CANCELLED' } });

    const totalRevenue = await Order.sum('total_price', { where: { status: 'PAID' } });

    const recentOrders = await Order.findAll({
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
        }]
    });

    return {
        totalOrders,
        pendingOrders,
        paidOrders,
        cancelledOrders,
        totalRevenue: totalRevenue || 0,
        recentOrders
    };
};