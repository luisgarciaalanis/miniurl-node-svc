/**
 * urls table model.
 */
const Urls = (sequelize, type) => sequelize.define('urls', {
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
    isCustom: {
        type: type.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = Urls;
