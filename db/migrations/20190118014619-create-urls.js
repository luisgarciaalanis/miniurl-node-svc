
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('urls', {
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
            unique: false,
        },
        hash: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: '~',
        },
        isCustom: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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
    down: queryInterface => queryInterface.dropTable('urls'),
};
