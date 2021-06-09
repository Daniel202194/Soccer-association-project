// jest.mock('../../matches_utils')

const { setMatch } = require('../../routes/utils/matches_utils');
const { getTeams } = require('../../routes/utils/teams_utils');
const { getSeasonPolicy } = require('../../routes/utils/seasons_utils');
const { getMatchesByseason } = require('../../routes/utils/matches_utils');


test('check valid parameters in set match', async () => {
    const result = await setMatch('aa', '10', '2021-09-15T16:00:00.0000000', 'STADIUM_2', '2021-2022', '1');

    expect(result).toBe(400);
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
