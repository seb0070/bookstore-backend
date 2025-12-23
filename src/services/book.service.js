const { Book } = require('../models');
const { Op } = require('sequelize');

// 전체 조회 (페이지네이션 + 검색 + 정렬)
exports.getBooks = async (query) => {
    const {
        page = 1,
        limit = 10,
        sort = 'created_at',
        order = 'DESC',
        keyword,
    } = query;

    const offset = (page - 1) * limit;

    const where = {};

    if (keyword) {
        where.title = {
            [Op.like]: `%${keyword}%`,
        };
    }

    const { rows, count } = await Book.findAndCountAll({
        where,
        limit: Number(limit),
        offset: Number(offset),
        order: [[sort, order]],
    });

    return {
        content: rows,
        page: Number(page),
        limit: Number(limit),
        totalElements: count,
        totalPages: Math.ceil(count / limit),
    };
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

// 삭제 (soft delete)
exports.deleteBook = async (id) => {
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error('BOOK_NOT_FOUND');
        error.status = 404;
        throw error;
    }

    if (book.status === 'DELETED') {
        const error = new Error('BOOK_ALREADY_DELETED');
        error.status = 409;
        throw error;
    }

    await book.update({
        status: 'DELETED',
        deleted_at: new Date(),
    });

    return book;
};
