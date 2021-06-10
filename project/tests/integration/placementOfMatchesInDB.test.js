const teams_utils = require("../../routes/utils/teams_utils");
const { setByPolicy } = require('../../routes/utils/representive_manager_utils.js');

describe('check valid parameters in  function setByPolicy - integration test', () => {

    test('should return error by given worng season name', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2023-2020');
        expect(result).toBe(400);
    });

    test('should return error by given null in parameters', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(null, teams_details, "", '2023-2020');
        expect(result).toBe(400);
    });

    test('should return error because it the session in the past', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2019-2020');
        expect(result).toBe(400);
    });

    test('should return error because the session is happend now and we can not able to make changes ', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2021-2022');
        expect(result).toBe(400);
    });

    test('success - Checks that the data we have received is correct and arranges the data in accordance with the policy ', async() => 
    {
        const teams_details = await teams_utils.getTeams(1);
        console.log(teams_details);
        const result = await setByPolicy(1, teams_details, 1, '2022-2023');
        expect(result).toBe(200);
    });
});
