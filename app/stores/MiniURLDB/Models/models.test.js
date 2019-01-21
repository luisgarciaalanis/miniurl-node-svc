const models = require('./index');

/* global it, describe, expect */

describe('Testing models', () => {
    it('test init', () => {
        let calls = 0;
        const sequelize = {
            import: () => {
                calls++;
            },
        };

        expect(models.init(sequelize)).toBe(true);
        expect(calls).toBe(1);
    });
});
