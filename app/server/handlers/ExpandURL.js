const Boom = require('boom');
const usecases = require('../../usecases');
const isValidHash = require('../../usecases/isValidHash');

class ExpandURL {
    /**
     * resolves a hash into a url handler.
     * @param {*} request
     * @param {*} h
     */
    async resolveHash(request, h) {
        let url = '';
        const hash = request.params.id.toLowerCase();

        if (!isValidHash(hash)) {
            return Boom.badRequest();
        }

        try {
            url = await usecases.urlFromHash(hash);
        } catch (e) {
            return Boom.notFound();
        }

        return h.redirect(url);
    }
}

module.exports = new ExpandURL();
