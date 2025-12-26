'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // provider 컬럼 추가
        await queryInterface.addColumn('users', 'provider', {
            type: Sequelize.ENUM('LOCAL', 'GOOGLE', 'FIREBASE'),
            allowNull: false,
            defaultValue: 'LOCAL',
            after: 'password_hash'
        });

        // provider_id 컬럼 추가
        await queryInterface.addColumn('users', 'provider_id', {
            type: Sequelize.STRING(255),
            allowNull: true,
            unique: true,
            after: 'provider'
        });

        // password_hash를 nullable로 변경 (소셜 로그인은 비밀번호 불필요)
        await queryInterface.changeColumn('users', 'password_hash', {
            type: Sequelize.STRING(255),
            allowNull: true
        });

        // provider_id 인덱스 추가
        await queryInterface.addIndex('users', ['provider_id'], {
            name: 'idx_users_provider_id'
        });
    },

    async down(queryInterface, Sequelize) {
        // 인덱스 제거
        await queryInterface.removeIndex('users', 'idx_users_provider_id');

        // provider_id 컬럼 제거
        await queryInterface.removeColumn('users', 'provider_id');

        // provider 컬럼 제거
        await queryInterface.removeColumn('users', 'provider');

        // password_hash를 다시 not null로 변경
        await queryInterface.changeColumn('users', 'password_hash', {
            type: Sequelize.STRING(255),
            allowNull: false
        });
    }
};