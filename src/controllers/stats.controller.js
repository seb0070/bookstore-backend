const statsService = require('../services/stats.service');

exports.getBookStats = async (req, res, next) => {
    try {
        const stats = await statsService.getBookStats();
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};

exports.getUserStats = async (req, res, next) => {
    try {
        const stats = await statsService.getUserStats();
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};

exports.getOrderStats = async (req, res, next) => {
    try {
        const stats = await statsService.getOrderStats();
        res.status(200).json(stats);
    } catch (err) {
        next(err);
    }
};

module.exports = exports;