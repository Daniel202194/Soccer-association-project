const { getReferee } = require('../../routes/utils/referee_utils');
const { getMatch } = require('../../routes/utils/matches_utils');
const { isRefereeBusy } = require('../../routes/utils/representive_manager_utils.js');


describe('Checker entered correct data to getReferee - unit tests', () => {
    test('Test missing fields in function getReferee', async () =>
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
    test('Test missing fields in function getMatch', async () =>
    {
        const result1 = await getMatch("");
        expect(result1).toBe("Missing field, make sure you entered: match_id in type integer");
        const result2 = await getMatch("sdsg");
        expect(result2).toBe("Missing field, make sure you entered: match_id in type integer");
        const result3 = await getMatch("125s");
        expect(result3).toBe("Missing field, make sure you entered: match_id in type integer");
    });

    test('Successfully, No details are missing for getMatch', async () =>
    {
        const result = await getMatch(121);
        expect(result[0].length).not.toBe(0);
    });
});

describe('Checker entered correct data to isRefereeBusy - unit tests', () => {
    test('Test missing fields in function isRefereeBusy', async () =>
    {
        const result1 = await isRefereeBusy("");
        expect(result1).toBe("Missing field, make sure you entered: match in type match and date_future_match in type Date");
        const result2 = await isRefereeBusy("sdsg");
        expect(result2).toBe("Missing field, make sure you entered: match in type match and date_future_match in type Date");
        const result3 = await isRefereeBusy("sdsg","");
        expect(result3).toBe("Missing field, make sure you entered: match in type match and date_future_match in type Date");
        const result4 = await isRefereeBusy("sdsFDF456g","6666vcvcx");
        expect(result4).toBe("make sure you entered: date_future_match in type Date");
    });

    test('Successfully, No details are missing for function isRefereeBusy', async () =>
    {
        const result = await isRefereeBusy(new Date('2021-09-15') ,new Date('2021-09-15'));
        expect(result).toBe(true);
    });
});