const { addRefereesToMatch } = require('../../routes/utils/representive_manager_utils.js');
const { getRFA } = require('../../routes/utils/representive_manager_utils.js');


//to check again
describe('Adding a referee to a game at DB', () => {
    test('The referee was added successfully', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 12, 125);
        expect(result).toBe(3);
    });
    
    test('Failure, the referee was not added', async () =>
    {
        const result1 = await addRefereesToMatch(10, 11, 11, 119);
        expect(result1).not.toBe(3);
        const result2 = await addRefereesToMatch(10, 12, 12, 119);
        expect(result2).not.toBe(3);
        const result3 = await addRefereesToMatch(12, 12, 12, 87);
        expect(result3).not.toBe(3);
        const result4 = await addRefereesToMatch(11, 12, 12, 87);
        expect(result4).not.toBe(3);
        const result5 = await addRefereesToMatch(10, 10, 12, 87);
        expect(result5).not.toBe(3);
        const result6 = await addRefereesToMatch(10, 10, 12, 1);
        expect(result6).not.toBe(3);
        const result7 = await addRefereesToMatch(13, 14, 70, 71);
        expect(result7).not.toBe(3);
    });
    
});

describe('Check that RFA subscribes to the system', () => {
    test('successfully, RFA is in the system', async () =>
    {
        const result = await getRFA();
        expect(result).toEqual({"username": "daniel"});
    });
    
});