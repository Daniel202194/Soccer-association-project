// jest.mock('../../matches_utils')
const DButils = require("../../routes/utils/DButils");
const { setMatch } = require('../../routes/utils/matches_utils');
const { getTeams } = require('../../routes/utils/teams_utils');
const { getSeasonPolicy } = require('../../routes/utils/seasons_utils');
const { getMatchesByseason } = require('../../routes/utils/matches_utils');

async function delet_me(){
    const match = await DButils.execQuery(
        `select match_id from dbo.matches WHERE 
        home_team = 1 and out_team = 3 AND league_id = 1 and season_name = '2021-2022'`
    );
    console.log(match);
    await DButils.execQuery(
        `delete from dbo.matches where match_id = '${match[0].match_id}'`
    );
}

describe('setMatch - unit tests', () => {
    test('check valid parameters in set match - failure', async () => {
        const result = await setMatch('aa', '10', new Date('2021-09-15'), 'STADIUM_2', '2021-2022', '1');
        expect(result).toBe(400);
    });

    test('check valid parameters in set match -success', async () => {
        const result = await setMatch(1, 3, new Date('2021-10-13'), 'STADIUM_1', '2021-2022', 1);
        expect(result).toBe(200);
        await delet_me();
    });
});
describe('matches by season- unit tests', () => {
    test('check valid parameters in get maches by worng season name', async () => {
        const result = await getMatchesByseason('2020', 1);
        expect(result.length).toBe(0);
    });

    test('check valid parameters in get maches by no exist leage id', async () => {
        const result = await getMatchesByseason('2020-2021', 5);
        expect(result.length).toBe(0);
    });
});


describe('teams on league - unit tests', () => {
    test('should return all teams by given league ID', async () => {
        const result = await getTeams(1);
        expect(result.length).toBe(4);
    });

});

describe('policy of set matches  - unit tests', () => {

    test('should return the policy number by given season and league id', async () => {
        const result = await getSeasonPolicy('2021-2022', 1);
        expect(result[0].matches_policy).toBe(1);
    });


});
