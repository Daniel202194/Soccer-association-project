const { addRefereesToMatch } = require('../../routes/utils/representive_manager_utils.js');
const { getRFA } = require('../../routes/utils/representive_manager_utils.js');
const DButils = require("../../routes/utils/DButils");

afterEach(async() => {
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 126`
    );
});

//to check again
describe('Adding a referee to a game at DB', () => {
    test('The referee was added successfully', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 12, 126);
        expect(result).toBe(3);
    });
    
    test('Failure, the referee was not added - referee is in other game ', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 11, 127);
        expect(result).not.toEqual(3);
        const result1 = await addRefereesToMatch(10, 11, 11, 119);
        expect(result1).not.toEqual(3);
        const result2 = await addRefereesToMatch(10, 12, 12, 128);
        expect(result2).not.toEqual(3);
        const result3 = await addRefereesToMatch(12, 12, 12, 129);
        expect(result3).not.toEqual(3);
        const result4 = await addRefereesToMatch(11, 12, 12, 130);
        expect(result4).not.toEqual(3);
        // const result5 = await addRefereesToMatch(10, 10, 12, 87);
        // expect(result5).not.toEqual(3);
        // const result6 = await addRefereesToMatch(10, 10, 12, 125);
        // expect(result6).not.toEqual(3);
        // const result7 = await addRefereesToMatch(13, 14, 70, 71);
        // expect(result7).not.toEqual(3);
    });

    test('Failure, the referee was not added - match does not exists! ', async () =>
    {
        const result5 = await addRefereesToMatch(10, 10, 12, 87);
        console.log(result5);
        expect(result5.status).toEqual(401);
        expect(result5.message).toEqual("match does not exists!");
        // const result6 = await addRefereesToMatch(10, 10, 12, 125);
        // expect(result6.status).toEqual(401);
        // expect(result6.text).toEqual("match does not exists!");
        // const result7 = await addRefereesToMatch(13, 14, 70, 71);
        // expect(result7.status).toEqual(401);
        // expect(result7.text).toEqual("match does not exists!");
    });
    
    
});

describe('Check that RFA subscribes to the system', () => {
    test('successfully, RFA is in the system', async () =>
    {
        const result = await getRFA();
        expect(result).toEqual({"username": "daniel"});
    });
    
});