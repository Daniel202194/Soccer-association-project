const DButils = require("./DButils");

async function getMatch(match_id) {
  const match = (
    await DButils.execQuery(
      `SELECT * FROM dbo.matches WHERE match_id = '${match_id}'`
    )
  );
  return match;
}

async function getMaches() {
  let matches = (
    await DButils.execQuery("SELECT * FROM dbo.matches")
  );
  return (matches);
}

async function getMatchesByseason(season_name, league_id) {
  let matches = (
    await DButils.execQuery(`SELECT * FROM dbo.matches where league_id = '${league_id}' and season_name = '${season_name}'`)
  );
  return (matches);
}

async function setMatch(home_team, out_team, match_date, stadium, season_name, league_id) {
  await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team, league_id, season_name) values ('${match_date}','${stadium}','${home_team}','${out_team}','${league_id}','${season_name}')`)

}

exports.setMatch = setMatch;
exports.getMaches = getMaches;
exports.getMatch = getMatch;
exports.getMatchesByseason = getMatchesByseason;