/**
 * custom urls table model.
 */
const CustomUrls = (sequelize, type) => sequelize.define('urls', {
    id: {
        type: type.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: type.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: '~',
    },
    hash: {
        type: type.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: '~',
    },
});

module.exports = CustomUrls;
