const DButils = require("./DButils");

async function getMatch(match_id) {
  if (match_id == null || match_id == "" || match_id != parseInt(match_id)) {
    return "Missing field, make sure you entered: match_id in type integer";
  }
  const match = (
    await DButils.execQuery(
      `SELECT * FROM dbo.matches WHERE match_id = '${match_id}'`
    )

  );
  return match;
}

// async function getMacthes() {
//   let matches = (
//     await DButils.execQuery("SELECT * FROM dbo.matches")
//   );
//   return (matches);
// }

async function getMatchesByseason(season_name, league_id) {
  let matches = (
    await DButils.execQuery(`SELECT * FROM dbo.matches where league_id = '${league_id}' and season_name = '${season_name}'`)
  );
  return (matches);
}

async function setMatch(home_team, out_team, match_date, stadium, season_name, league_id) {
  if (home_team == null || home_team == '' || out_team == null || out_team == '' || match_date == null || match_date == ''
    || stadium == null || stadium == '' || season_name == null || season_name == '' || league_id == null || league_id == '')
    return 400;
  if (match_date instanceof Date)
    if (parseInt(home_team) == home_team && parseInt(out_team) == out_team)
      if (typeof stadium === 'string') {
        tt = season_name.split('-');
        if (parseInt(season_name.split('-')[0]) == season_name.split('-')[0] && parseInt(season_name.split('-')[1]) == season_name.split('-')[1])
          if (parseInt(league_id) == league_id) {
            const date_m = match_date.toISOString().slice(0, 16).replace('T', ' ');
            await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team, league_id, season_name) values ('${date_m}','${stadium}','${home_team}','${out_team}','${league_id}','${season_name}')`)
            return 200;
          }
      }
      else
        return 400;
  return 400;
}


exports.setMatch = setMatch;
// exports.getMacthes = getMacthes;
exports.getMatch = getMatch;
exports.getMatchesByseason = getMatchesByseason;