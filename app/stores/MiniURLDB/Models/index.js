const Urls = require('./Urls');
const CustomUrls = require('./CustomUrls');
/**
 * Initializes the SQL models.
 */
class Models {
    init(sequelize) {
        this.urls = sequelize.import('urls', Urls);
        this.customUrls = sequelize.import('customUrls', CustomUrls);
        return true;
    }
}

module.exports = new Models();
