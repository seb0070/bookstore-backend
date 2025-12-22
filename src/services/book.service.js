const { Book } = require('../models');

exports.getBooks = async () => {
    return await Book.findAll();
};
