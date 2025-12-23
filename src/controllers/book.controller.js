const bookService = require('../services/book.service');

exports.getBooks = async (req, res, next) => {
    try {
        const books = await bookService.getBooks();
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
};

// GET /api/books/:id
exports.getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.getBookById(id);
        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

// POST /api/books
exports.createBook = async (req, res, next) => {
    const book = await bookService.createBook(req.body);

    res.json({
        ...book.toJSON(),
        authors: JSON.parse(book.authors),
        categories: JSON.parse(book.categories),
    });

};

// PATCH /api/books/:id
exports.updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.updateBook(id, req.body);

        res.status(200).json({
            ...book.toJSON(),
            authors: JSON.parse(book.authors),
            categories: JSON.parse(book.categories),
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/books/:id
exports.deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        await bookService.deleteBook(id);

        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
};


