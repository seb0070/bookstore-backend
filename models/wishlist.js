'use strict';

module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define(
        'Wishlist',
        {},
        {
            tableName: 'wishlists',
            timestamps: false,
            underscored: true,
        }
    );

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
        Wishlist.belongsTo(models.Book, { foreignKey: 'book_id' });
    };

    return Wishlist;
};
