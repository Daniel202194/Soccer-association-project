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

<<<<<<< HEAD
// async function getMaches() {
=======
// async function getMacthes() {
>>>>>>> 9690d640488af740609ae725f7cb8d69d970076e
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
  await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team, league_id, season_name) values ('${match_date}','${stadium}','${home_team}','${out_team}','${league_id}','${season_name}')`)
}

exports.setMatch = setMatch;
<<<<<<< HEAD
// exports.getMaches = getMaches;
=======
// exports.getMacthes = getMacthes;
>>>>>>> 9690d640488af740609ae725f7cb8d69d970076e
exports.getMatch = getMatch;
exports.getMatchesByseason = getMatchesByseason;