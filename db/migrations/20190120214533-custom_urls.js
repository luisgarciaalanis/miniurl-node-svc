

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('custom_urls', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        hash: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()'),
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('NOW()'),
        },
    }),
    down: queryInterface => queryInterface.dropTable('custom_urls'),

};
