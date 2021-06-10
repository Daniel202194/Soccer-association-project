const DButils = require("./DButils");

/**
 * get details of a given id of match
 * @param {*} match_id 
 * @returns 
 */
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

/**
 * 
 * @param {*} season_name 
 * @param {*} league_id 
 * @returns get all matches from a league and season that given
 */
async function getMatchesByseason(season_name, league_id) {
  if (season_name == null || league_id == null || season_name == '' || league_id == '')
    return 400;////one of the params is null or empty
  let matches = (
    await DButils.execQuery(`SELECT * FROM dbo.matches where league_id = '${league_id}' and season_name = '${season_name}'`)
  );
  return (matches);
}

/**
 * 
 * @param {*} home_team must be an integer
 * @param {*} out_team must be an integer
 * @param {*} match_date must be a Date object
 * @param {*} stadium must be a string
 * @param {*} season_name must be a string, and the years must be onsecutive years
 * @param {*} league_id must be an integer
 * @returns insert a match into the table 'matches' in case of all the params are correct
 */
async function setMatch(home_team, out_team, match_date, stadium, season_name, league_id) {
  if (home_team == null || home_team == '' || out_team == null || out_team == '' || match_date == null || match_date == ''
    || stadium == null || stadium == '' || season_name == null || season_name == '' || league_id == null || league_id == '')
    return 400; ////one of the params is null or empty
  if (match_date instanceof Date && parseInt(home_team) == home_team && parseInt(out_team) == out_team &&
    typeof stadium === 'string' && parseInt(season_name.split('-')[0]) == season_name.split('-')[0] &&
    parseInt(season_name.split('-')[1]) == season_name.split('-')[1] && parseInt(league_id) == league_id) {
    const date_m = match_date.toISOString().slice(0, 16).replace('T', ' ');
    await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team, league_id, season_name) values ('${date_m}','${stadium}','${home_team}','${out_team}','${league_id}','${season_name}')`)
    return 200; ///all the params is correct
  }
  return 400; ////one of the params is incorrect

}

exports.setMatch = setMatch;
exports.getMatch = getMatch;
exports.getMatchesByseason = getMatchesByseason;