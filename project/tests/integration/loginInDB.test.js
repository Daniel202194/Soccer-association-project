const { existUsername } = require('../../routes/utils/authUtils');

describe('login - integration tests', () => {
    test('check if the username exists in DB', async () => {
        const user = await existUsername('daniel');
        expect(user.username).toBe('daniel');
    });

    test('check if the username do not exists in DB', async () => {
        const user = await existUsername('jxcxjc');
        expect(user).toBe(0);
    });
});
