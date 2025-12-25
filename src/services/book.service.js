const { Book } = require('../models');
const { Op } = require('sequelize');

exports.getBooks = async (query) => {
    const page = parseInt(query.page, 10) || 0;
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
        status: 'ACTIVE'
    };

    if (query.keyword) {
        where[Op.or] = [
            { title: { [Op.like]: `%${query.keyword}%` } },
            { description: { [Op.like]: `%${query.keyword}%` } }
        ];
    }

    if (query.category) {
        // JSON 배열에 특정 카테고리가 포함되어 있는지 검색
        where.categories = {
            [Op.like]: `%"${query.category}"%`
        };
    }

    const { rows, count } = await Book.findAndCountAll({
        where,
        limit: size,
        offset,
        order,
        attributes: { exclude: ['deleted_at'] }
    });

    // JSON 필드 파싱
    const books = rows.map(book => {
        const bookData = book.toJSON();
        return {
            ...bookData,
            authors: typeof bookData.authors === 'string' ? JSON.parse(bookData.authors) : bookData.authors,
            categories: typeof bookData.categories === 'string' ? JSON.parse(bookData.categories) : bookData.categories
        };
    });

    return {
        content: books,
        page,
        size,
        totalElements: count,
        totalPages: Math.ceil(count / size),
        sort: query.sort || 'created_at,DESC'
    };
};

exports.getBookById = async (id) => {
    const book = await Book.findByPk(id);

    if (!book || book.status === 'DELETED') {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    // JSON 필드 파싱
    const bookData = book.toJSON();
    return {
        ...bookData,
        authors: typeof bookData.authors === 'string' ? JSON.parse(bookData.authors) : bookData.authors,
        categories: typeof bookData.categories === 'string' ? JSON.parse(bookData.categories) : bookData.categories
    };
};

exports.createBook = async (data, createdBy) => {
    const {
        title,
        description,
        isbn,
        authors,
        categories,
        publisher,
        price,
        published_year,
        stock_quantity,
        cover_image
    } = data;

    // 필수 필드 검증
    if (!title || !authors || !categories || !price || !published_year) {
        const error = new Error('필수 항목이 누락되었습니다.');
        error.status = 400;
        error.code = 'REQUIRED_FIELD_MISSING';
        throw error;
    }

    // ISBN 중복 확인
    if (isbn) {
        const existingBook = await Book.findOne({ where: { isbn } });
        if (existingBook) {
            const error = new Error('이미 등록된 ISBN입니다.');
            error.status = 409;
            error.code = 'DUPLICATE_ISBN';
            throw error;
        }
    }

    const book = await Book.create({
        title,
        description,
        isbn,
        authors: JSON.stringify(authors),
        categories: JSON.stringify(categories),
        publisher,
        price,
        published_year,
        stock_quantity: stock_quantity || 0,
        cover_image,
        status: 'ACTIVE',
        created_by: createdBy
    });

    // JSON 필드 파싱하여 반환
    const bookData = book.toJSON();
    return {
        ...bookData,
        authors: JSON.parse(bookData.authors),
        categories: JSON.parse(bookData.categories)
    };
};

exports.updateBook = async (id, data) => {
    const book = await Book.findByPk(id);

    if (!book || book.status === 'DELETED') {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    const {
        title,
        description,
        isbn,
        authors,
        categories,
        publisher,
        price,
        published_year,
        stock_quantity,
        cover_image
    } = data;

    // 배열 검증
    if (authors && !Array.isArray(authors)) {
        const error = new Error('authors는 배열이어야 합니다.');
        error.status = 400;
        error.code = 'INVALID_AUTHORS';
        throw error;
    }

    if (categories && !Array.isArray(categories)) {
        const error = new Error('categories는 배열이어야 합니다.');
        error.status = 400;
        error.code = 'INVALID_CATEGORIES';
        throw error;
    }

    await book.update({
        title: title ?? book.title,
        description: description ?? book.description,
        isbn: isbn ?? book.isbn,
        authors: authors ? JSON.stringify(authors) : book.authors,
        categories: categories ? JSON.stringify(categories) : book.categories,
        publisher: publisher ?? book.publisher,
        price: price ?? book.price,
        published_year: published_year ?? book.published_year,
        stock_quantity: stock_quantity ?? book.stock_quantity,
        cover_image: cover_image ?? book.cover_image
    });

    // JSON 필드 파싱하여 반환
    const bookData = book.toJSON();
    return {
        ...bookData,
        authors: JSON.parse(bookData.authors),
        categories: JSON.parse(bookData.categories)
    };
};

exports.deleteBook = async (id) => {
    const book = await Book.findByPk(id);

    if (!book) {
        const error = new Error('도서를 찾을 수 없습니다.');
        error.status = 404;
        error.code = 'BOOK_NOT_FOUND';
        throw error;
    }

    if (book.status === 'DELETED') {
        const error = new Error('이미 삭제된 도서입니다.');
        error.status = 409;
        error.code = 'BOOK_ALREADY_DELETED';
        throw error;
    }

    await book.update({
        status: 'DELETED',
        deleted_at: new Date()
    });

    return true;
};