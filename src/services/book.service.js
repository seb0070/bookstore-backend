const { Book } = require('../models');

// 전체 조회
exports.getBooks = async () => {
    return await Book.findAll();
};

// 단건 조회
exports.getBookById = async (id) => {
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error('BOOK_NOT_FOUND');
        error.status = 404;
        throw error;
    }

    return book;
};

// 생성
exports.createBook = async (data) => {
    const {
        title,
        description,
        authors,
        categories,
        price,
        published_year,
    } = data;

    // 최소 필수 검증
    if (!title || !authors || !categories || !price || !published_year) {
        const error = new Error('REQUIRED_FIELD_MISSING');
        error.status = 400;
        throw error;
    }

    return await Book.create({
        title,
        description,
        authors: JSON.stringify(authors),
        categories: JSON.stringify(categories),
        price,
        published_year,
        status: 'ACTIVE',
        stock_quantity: 0,
        created_by: 1,
    });

};

// 수정
exports.updateBook = async (id, data) => {
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error('BOOK_NOT_FOUND');
        error.status = 404;
        throw error;
    }

    const {
        title,
        description,
        authors,
        categories,
        price,
        published_year,
        stock_quantity,
        status,
    } = data;

    if (authors && !Array.isArray(authors)) {
        const error = new Error('INVALID_AUTHORS');
        error.status = 400;
        throw error;
    }

    if (categories && !Array.isArray(categories)) {
        const error = new Error('INVALID_CATEGORIES');
        error.status = 400;
        throw error;
    }

    await book.update({
        title: title ?? book.title,
        description: description ?? book.description,
        authors: authors ? JSON.stringify(authors) : book.authors,
        categories: categories ? JSON.stringify(categories) : book.categories,
        price: price ?? book.price,
        published_year: published_year ?? book.published_year,
        stock_quantity: stock_quantity ?? book.stock_quantity,
        status: status ?? book.status,
    });

    return book;
};
