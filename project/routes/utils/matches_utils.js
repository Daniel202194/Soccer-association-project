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
  
async function setMatch(home_team,out_team,match_date,stadium) {
        await DButils.execQuery(`INSERT INTO dbo.matches (match_date, stadium,home_team, out_team) values ('${match_date}','${stadium}','${home_team}','${out_team}')`)

}
    
exports.setMatch = setMatch;
exports.getMaches = getMaches;
exports.getMatch = getMatch;