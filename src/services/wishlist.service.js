const { Wishlist, Book } = require('../models');

exports.addToWishlist = async (userId, bookId) => {
    const book = await Book.findByPk(bookId);
    if (!book || book.status === 'DELETED') {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    const existing = await Wishlist.findOne({
        where: { user_id: userId, book_id: bookId }
    });

    if (existing) {
        const error = new Error('이미 위시리스트에 추가된 도서입니다.');
        error.status = 409;
        error.code = 'DUPLICATE_RESOURCE';
        throw error;
    }

    await Wishlist.create({ user_id: userId, book_id: bookId });
    return { message: '위시리스트에 추가되었습니다.' };
};

exports.getMyWishlist = async (userId, query = {}) => {
    const page = parseInt(query.page) || 0;
    const size = parseInt(query.size) || 10;
    const offset = page * size;

    const { rows: wishlists, count } = await Wishlist.findAndCountAll({
        where: { user_id: userId },
        include: [{
            model: Book,
            as: 'book',
            where: { status: 'ACTIVE' },
            attributes: ['id', 'title', 'price', 'cover_image', 'authors', 'categories']
        }],
        limit: size,
        offset,
        order: [['created_at', 'DESC']]
    });

    // JSON 파싱
    const items = wishlists.map(w => {
        const book = w.book.toJSON();
        return {
            ...w.toJSON(),
            book: {
                ...book,
                authors: typeof book.authors === 'string' ? JSON.parse(book.authors) : book.authors,
                categories: typeof book.categories === 'string' ? JSON.parse(book.categories) : book.categories
            }
        };
    });

    return {
        content: items,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size)
    };
};

exports.removeFromWishlist = async (userId, bookId) => {
    const wishlist = await Wishlist.findOne({
        where: { user_id: userId, book_id: bookId }
    });

    if (!wishlist) {
        const error = new Error('위시리스트에 해당 도서가 없습니다.');
        error.status = 404;
        error.code = 'RESOURCE_NOT_FOUND';
        throw error;
    }

    await wishlist.destroy();
    return { message: '위시리스트에서 제거되었습니다.' };
};