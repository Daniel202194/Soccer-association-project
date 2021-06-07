const DButils = require("./DButils");


///maybe change the manager to representative
///////////////////////////////////change
async function getManager(){
    const manager = await DButils.execQuery(
      `select * from dbo.users where role=manager`
    );
    return manager;
  }

async function addRefereeToMatch(referee_id, match_id) {
    ///get al matches the referee is in there
    const referee_in_matches = await DButils.execQuery(
        `select match_id,date_match,referee_id from dbo.match where referee_id = '${referee_id}'`
    );
    ////get the date of the match that the representator want to add the referee there
    const date_match = await DButils.execQuery(
    `select date_match from dbo.match where match_id = '${match_id}'`
    )[0];
    ////get all the games that the referee in there and collide in the date of the current game 
    for (let i = 0;i<referee_in_matches.length;i++){
        if(referee_in_matches.date_match.getYear() == date_match.getYear() &&
        referee_in_matches.date_match.getMonth() == date_match.getMonth() &&
        referee_in_matches.date_match.getDay() == date_match.getDay()){
            return null;
        }
    }
    await DButils.execQuery(
      `update dbo.match set referee_id = '${referee_id}' where match_id = '${match_id}'`
    );
    return 1;
  }

  exports.getManager = getManager; /////////////////change
  exports.addRefereeToMatch = addRefereeToMatch;