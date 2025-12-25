const bookService = require('../services/book.service');

exports.getBooks = async (req, res, next) => {
    try {
        const result = await bookService.getBooks(req.query);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.getBookById(id);
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

exports.createBook = async (req, res, next) => {
    try {
        const book = await bookService.createBook(req.body, req.user.id);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.updateBook(id, req.body);
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        await bookService.deleteBook(id);
        res.status(200).json({
            message: '도서가 삭제되었습니다.'
        });
    } catch (error) {
        next(error);
    }
};