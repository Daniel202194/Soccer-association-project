const DButils = require("./DButils");

async function getTeams(league_id) {
    let teams = (
        await DButils.execQuery(`SELECT * FROM dbo.teams where league_id = ${league_id}`)
    );
    return (teams);
}

exports.getTeams = getTeams;