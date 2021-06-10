
const DButils = require("./DButils");


/**
 * The function get season name like '2019-2020' and league id and return policy of set games  
 * @param {*} season_name 
 * @param {*} league_id 
 * @returns 
 */
async function getSeasonPolicy(season_name, league_id) {
  let match_policy = (
      await DButils.execQuery(`SELECT matches_policy FROM dbo.seasons where season_name='${season_name}'  AND league_id = '${league_id}' `)
  );
  return (match_policy);
}

exports.getSeasonPolicy = getSeasonPolicy;