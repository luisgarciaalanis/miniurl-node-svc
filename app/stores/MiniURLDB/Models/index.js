const Urls = require('./Urls');

/**
 * Initializes the SQL models.
 */
class Models {
    init(sequelize) {
        this.urls = sequelize.import('urls', Urls);
    }
}

module.exports = new Models();
