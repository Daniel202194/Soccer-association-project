const { getReferee } = require('../../routes/utils/referee_utils');

//describe('Check that the referee is a subscriber to the system - unit tests', () => {
    test('Test missing fields', async () =>
    {
        const result = await getReferee("");
        expect(result).toBe("Missing field, make sure you entered: userName");
    });

    test('Successfully referee is subscribed in the system', async () =>
    {
        const result = await getReferee("referee_1");
        expect(result[0].referee_id).toBe("1");
    });
//});