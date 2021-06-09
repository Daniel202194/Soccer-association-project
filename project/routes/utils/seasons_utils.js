const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");



// async function getSeason(season_name) {
//   let season = (
//       await DButils.execQuery(`SELECT * FROM dbo.seasons WHERE season_name='${season_name}'` )
//   );
//   return (season);
// }


async function getSeasonPolicy(season_name, league_id) {
  let match_policy = (
      await DButils.execQuery(`SELECT matches_policy FROM dbo.seasons where season_name='${season_name}'  AND league_id = '${league_id}' `)
  );
  return (match_policy);
}




// exports.getSeason = getSeason;
exports.getSeasonPolicy = getSeasonPolicy;