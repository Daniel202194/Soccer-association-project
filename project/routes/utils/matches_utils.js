const DButils = require("./DButils");

async function getMatch(match_id) {
  if(match_id == null || match_id == "" || match_id != parseInt(match_id)){
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
  if ((typeof home_team != 'integer')||(typeof out_team != 'integer')||(typeof match_date != 'datetime') ||
      (typeof stadium != 'string') || (typeof season_name != 'string')||(typeof league_id != 'integer')){
    return 400;
  }
      
  await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team, league_id, season_name) values ('${match_date}','${stadium}','${home_team}','${out_team}','${league_id}','${season_name}')`)
  return 200;
}


exports.setMatch = setMatch;
// exports.getMacthes = getMacthes;
exports.getMatch = getMatch;
exports.getMatchesByseason = getMatchesByseason;