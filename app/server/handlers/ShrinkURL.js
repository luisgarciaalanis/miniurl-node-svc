const Boom = require('boom');
const urlFromString = require('../../usecases/urlFromString');

class ShrinkURL {
    shrink(request) {
        const url = request.payload.url ? request.payload.url.trim() : '';
        this.verifyUrlOrFail(url);
    }

    verifyUrlOrFail(rawURL) {
        let url = null;

        if (!rawURL) {
            return Boom.badRequest('Missing URL');
        }

        try {
            url = urlFromString(rawURL);
        } catch (e) {
            return Boom.badRequest('Invalid URL');
        }

        // eslint-disable-next-line no-script-url
        if (url.protocol === 'javascript:') {
            return Boom.forbidden('javascript is not allowed!');
        }

        if (url.protocol === 'mailto:') {
            return true;
        }

        // URLs need to start with mailto:, http: or https:
        if (!url.protocol.startsWith('http')) {
            return Boom.badRequest('Invalid URL');
        }

        if (!url.href.length > 2000) {
            return Boom.uriTooLong('URL should be less or equal to 2000 characters!');
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

        return true;
    }
}

module.exports = new ShrinkURL();
