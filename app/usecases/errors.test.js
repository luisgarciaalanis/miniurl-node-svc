const { HashAlreadyTaken } = require('./errors');

/* global it, describe, expect */

describe('test errors...', () => {
    it('HashAlreadyTaken has right type and message', () => {
        try {
            throw new HashAlreadyTaken('some msg');
        } catch (e) {

            expect(e instanceof HashAlreadyTaken).toBe(false);
            expect(e.message).toEqual('some msg');
        }
    });
});
