const { getReferee } = require('../../routes/utils/referee_utils');
const { getMatch } = require('../../routes/utils/matches_utils');

describe('Checker entered correct data to getReferee - unit tests', () => {
    test('Test missing fields', async () =>
    {
        const result = await getReferee("");
        expect(result).toBe("Missing field, make sure you entered: userName");
    });

    test('Successfully, No details are missing for getReferee', async () =>
    {
        const result = await getReferee("referee_1");
        expect(result[0].referee_id).toBe(1);
    });
});

describe('Checker entered correct data to getMatch - unit tests', () => {
    test('Test missing fields', async () =>
    {
        const result1 = await getMatch("");
        expect(result1).toBe("Missing field, make sure you entered: match_id in type integer");
        const result2 = await getMatch("sdsg");
        expect(result2).toBe("Missing field, make sure you entered: match_id in type integer");
    });

    test('Successfully, No details are missing for getMatch', async () =>
    {
        const result = await getMatch(71);
        expect(result[0].length).not.toBe(0);
    });
});