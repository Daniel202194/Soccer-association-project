const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");



async function getLeagues(league_id) {
  let leagues = (
      await DButils.execQuery("SELECT * FROM dbo.leagues where league_id=" + league_id)
  );
  return (leagues);
}


async function getLeaguePolicy(league_id) {
  let match_policy = (
      await DButils.execQuery(`SELECT matchesPolicy FROM dbo.leagues where league_id='${league_id}'`)
  );
  return (match_policy);
}



async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}
exports.getLeagueDetails = getLeagueDetails;
exports.getLeagues = getLeagues
exports.getLeaguePolicy = getLeaguePolicy