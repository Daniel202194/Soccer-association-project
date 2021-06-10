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

describe('Adding a referee to a game at DB', () => {
    test('The referee was added successfully', async () =>
    {
        const result = await addRefereesToMatch(10, 11, 12, 126);
        expect(result).toBe(3);
    });
    
    test('Failure, the referee was not added - referee is in other game ', async () =>
    {
        // 0 - the main referee is in other game
        // 1 - the first line referee is in other game  
        // 2 - the second line referee is in other game
        const result = await addRefereesToMatch(10, 8, 9, 138);
        expect(result).toEqual(0);
        const result1 = await addRefereesToMatch(7, 14, 9, 138);
        expect(result1).toEqual(1);
        const result2 = await addRefereesToMatch(7, 8, 15, 138);
        expect(result2).toEqual(2);
    });

    test('Failure, the referee was not added - match does not exists! ', async () =>
    {
        const result5 = await addRefereesToMatch(10, 10, 12, 87);
        console.log(result5);
        expect(result5.status).toEqual(401);
        expect(result5.message).toEqual("match does not exists!");
    });
    
    
});

describe('Check that RFA subscribes to the system', () => {
    test('successfully, RFA daniel is in the system', async () =>
    {
        const result = await getRFA();
        expect(result).toEqual({"username": "daniel"});
    });
    
});