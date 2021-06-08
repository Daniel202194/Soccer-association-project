const { addRefereesToMatch } = require('../../routes/utils/representive_manager_utils.js');
const { getRFA } = require('../../routes/utils/representive_manager_utils.js');


//to check again
describe('Adding a referee to a game at DB', () => {
    test('The referee was added successfully', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 12, 87);
        expect(result).toBe(3);
    });
    
    test('Failure, the referee was not added', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 11, 87);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(10, 12, 12, 87);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(12, 12, 12, 87);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(11, 12, 12, 87);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(10, 10, 12, 87);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(10, 10, 12, 1);
        expect(result).not.toBe(3);
        const result = await addRefereesToMatch(13, 14, 15, 71);
        expect(result).not.toBe(3);
    });
    
});

describe('Check that RFA subscribes to the system', () => {
    test('successfully, RFA is in the system', async () =>
    {
        const result = await getRFA();
        expect(result).toEqual({"username": "daniel"});
    });
    
});