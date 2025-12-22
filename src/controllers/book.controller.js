const bookService = require('../services/book.service');

exports.getBooks = async (req, res, next) => {
    try {
        const books = await bookService.getBooks();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};
