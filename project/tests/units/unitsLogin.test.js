const { existUsername } = require('../../routes/utils/authUtils');
const DButils = require("../../routes/utils/DButils");

describe('login - unit tests', () => {
    test('check username not empty- failure', async () => {
        const result = await existUsername();
        expect(result).toBe(0);
    });
    test('check username not null - failure', async () => {
        const result = await existUsername(null);
        expect(result).toBe(0);
    });
    test('check username not empty - failure', async () => {
        const result = await existUsername("");
        expect(result).toBe(0);
    });
});
