const teams_utils = require("../../routes/utils/teams_utils");
const { setByPolicy } = require('../../routes/utils/representive_manager_utils.js');

describe('check valid parameters in set policy- integration test', () => {

    test('should return error by given worng season name', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2023-2020');
        expect(result).toBe(400);
    });

    test('should return error by given null', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(null, teams_details, "", '2023-2020');
        expect(result).toBe(400);
    });

    test('should return error because it in past', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2019-2020');
        expect(result).toBe(400);
    });

    test('should return error because it is happend now', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2021-2022');
        expect(result).toBe(400);
    });

    test('should return error because it is happend now', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2022-2023');
        expect(result).toBe(200);
    });
});
