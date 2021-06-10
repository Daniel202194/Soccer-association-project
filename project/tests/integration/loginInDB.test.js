const { existUsername } = require('../../routes/utils/authUtils');
const DButils = require("../../routes/utils/DButils");

describe('login - integration tests', () => {
    test('check exists username in DB- success', async () => {
        const user = await existUsername('daniel');
        expect(user.username).toBe('daniel');
    });

    test('check exists username in DB- failure', async () => {
        const user = await existUsername('jxcxjc');
        expect(user).toBe(0);
    });
});
