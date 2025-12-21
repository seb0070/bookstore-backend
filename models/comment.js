'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.Review, { foreignKey: 'review_id' });
            Comment.belongsTo(models.User, { foreignKey: 'user_id' });
        }
    }

    Comment.init(
        {
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            likes_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'comments',
            underscored: true,
            timestamps: true,
        }
    );

    return Comment;
};
