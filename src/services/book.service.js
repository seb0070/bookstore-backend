const { Book } = require('../models');
const { Op } = require('sequelize');

// 전체 조회 (페이지네이션 + 검색 + 정렬)
exports.getBooks = async (query) => {
    const page = parseInt(query.page, 10) || 0;      // ⭐ 0-based
    const size = parseInt(query.size, 10) || 10;
    const offset = page * size;

    // 정렬 처리: sort=field,DESC
    let order = [['created_at', 'DESC']];
    if (query.sort) {
        const [field, direction] = query.sort.split(',');
        order = [[field, direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];
    }

    // 검색 조건
    const where = {
        status: 'ACTIVE', // ⭐ 논리 삭제 제외
    };

    if (query.keyword) {
        where[Op.or] = [
            { title: { [Op.like]: `%${query.keyword}%` } },
            { description: { [Op.like]: `%${query.keyword}%` } },
        ];
    }

    const { rows, count } = await Book.findAndCountAll({
        where,
        limit: size,
        offset,
        order,
    });

    return {
        content: rows,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size),
        sort: query.sort || 'created_at,DESC',
    };
};


// 단건 조회
exports.getBookById = async (id) => {
    const book = await Book.findByPk(id);


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
