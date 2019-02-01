const Boom = require('boom');
const usecases = require('../../usecases');
const { HashAlreadyTaken } = require('../../usecases/errors');

class ShrinkURL {
    constructor() {
        this.shrink = this.shrink.bind(this);
        this.verifyUrlOrFail = this.normalizeUrlOrFail.bind(this);
    }

    /**
     * Shrink URL POST request handler.
     * @param {*} request
     */
    async shrink(request) {
        const url = request.payload.url ? request.payload.url.trim() : '';
        const isCustom = !!request.payload.hash;
        let hash = isCustom ? request.payload.hash : '';
        const result = this.normalizeUrlOrFail(url);

        if (Boom.isBoom(result)) {
            return result;
        }

        if (isCustom && !usecases.isValidHash(hash)) {
            return Boom.badRequest('The custom hash is invalid!');
        }

        try {
            if (isCustom) {
                hash = await usecases.saveCustomURL(result, hash);
            } else {
                hash = await usecases.saveURL(result);
            }
        } catch (e) {
            if (e instanceof HashAlreadyTaken) {
                return Boom.conflict('Hash is already taken!');
            }
            return Boom.internal('ups, something went wrong!');
        }

        return {
            hash,
        };
    }

    /**
     * Normalizes a rawURL, verifies that its a valid URL.
     *
     * @param {string} rawURL url to normalize.
     * @returns {string|Boom} normalized URL if succeeded, Boom error otherwise.
     */
    normalizeUrlOrFail(rawURL) {
        let url = null;

        if (!rawURL) {
            return Boom.badRequest('Missing URL');
        }

        if (rawURL.length > 2083) {
            return Boom.uriTooLong('URL should be less or equal to 2083 characters!');
        }

        try {
            url = usecases.urlFromString(rawURL);
        } catch (e) {
            return Boom.badRequest('Invalid URL');
        }

        if (!usecases.isValidHost(url.host)) {
            return Boom.badRequest('Invalid URL');
        }

        // eslint-disable-next-line no-script-url
        if (url.protocol === 'javascript:') {
            return Boom.forbidden('javascript is not allowed!');
        }

        if (url.protocol === 'mailto:') {
            return url.href;
        }

        // URLs need to start with mailto:, http: or https:
        if (!url.protocol.startsWith('http')) {
            return Boom.badRequest('Invalid URL');
        }

        /** HACK: need a better way to handle this and any other fake DNS mimic, also protect against all the
         * ip addresses of the host, docker container including Ipv4 and Ipv6.
         * This hack is for demo purposes.
         * 1) get IPs of docker container.
         * 2) get IPs of host machine
         * 3) get hostname of URL being shrunk and run it against a DNS service.
         * 4) Make sure the ip does not match any of our IPs or fail otherwise. * */
        if (url.hostname === 'm.garcia.tv' || url.hostname === '13.91.40.170') {
            return Boom.forbidden('Nice try!!! you script kiddie!');
        }

        return url.href;
    }
}

module.exports = new ShrinkURL();
