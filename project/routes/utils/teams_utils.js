const DButils = require("./DButils");

/**
 * The function get league id and reutns all the teams of this league.
 * @param {*} league_id 
 * @returns 
 */
async function getTeams(league_id) {
    let teams = (
        await DButils.execQuery(`SELECT * FROM dbo.teams where league_id = ${league_id}`)
    );
    return (teams);
}

exports.getTeams = getTeams;