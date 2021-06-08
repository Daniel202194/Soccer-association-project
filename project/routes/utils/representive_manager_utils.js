const DButils = require("./DButils");


///maybe change the manager to representative
///////////////////////////////////change
async function getRFA(){
    const rfa = await DButils.execQuery(
      `select username from dbo.users where username = 'daniel'`
    );
    return rfa[0];
  }

async function addMainRefereeToMatch(referee_id, match_id) {
    ///get all matches the referee is in there
    const referee_in_matches = await DButils.execQuery(
        `select match_id,match_date,main_referee,first_line_referee,second_line_referee from dbo.matches where 
        main_referee = '${referee_id}' OR first_line_referee = '${referee_id}' OR second_line_referee = '${referee_id}'`
    );
    ////get the date of the match that the representator want to add the referee there
    const date_future_match = await DButils.execQuery(
    `select match_date from dbo.matches where match_id = '${match_id}'`
    );
    ////get all the games that the referee in there and collide in the date of the current game 
    for (let i = 0;i<referee_in_matches.length;i++){
        if(referee_in_matches[i].match_date.getYear() == date_future_match.getYear() &&
        referee_in_matches[i].match_date.getMonth() == date_future_match.getMonth() &&
        referee_in_matches[i].match_date.getDay() == date_future_match.getDay()){
            return 0;
        }
    }
    await DButils.execQuery(
      `update dbo.matches set main_referee = '${referee_id}' where match_id = '${match_id}'`
    );
    return 1;
  }

  async function addFirstLineRefereeToMatch(referee_id, match_id) {
    ///get all matches the referee is in there
    const referee_in_matches = await DButils.execQuery(
        `select match_id,match_date,main_referee,first_line_referee,second_line_referee from dbo.matches where 
        main_referee = '${referee_id}' OR first_line_referee = '${referee_id}' OR second_line_referee = '${referee_id}'`
    );
    ////get the date of the match that the representator want to add the referee there
    const date_future_match = await DButils.execQuery(
    `select match_date from dbo.matches where match_id = '${match_id}'`
    );
    ////get all the games that the referee in there and collide in the date of the current game 
    for (let i = 0;i<referee_in_matches.length;i++){
        if(referee_in_matches[i].match_date.getYear() == date_future_match.getYear() &&
        referee_in_matches[i].match_date.getMonth() == date_future_match.getMonth() &&
        referee_in_matches[i].match_date.getDay() == date_future_match.getDay()){
            return 0;
        }
    }
    await DButils.execQuery(
      `update dbo.matches set first_line_referee = '${referee_id}' where match_id = '${match_id}'`
    );
    return 1;
  }

  async function addSecondLineRefereeToMatch(referee_id, match_id) {
    ///get all matches the referee is in there
    const referee_in_matches = await DButils.execQuery(
        `select match_id,match_date,main_referee,first_line_referee,second_line_referee from dbo.matches where 
        main_referee = '${referee_id}' OR first_line_referee = '${referee_id}' OR second_line_referee = '${referee_id}'`
    );
    ////get the date of the match that the representator want to add the referee there
    const date_future_match = await DButils.execQuery(
    `select match_date from dbo.matches where match_id = '${match_id}'`
    );
    ////get all the games that the referee in there and collide in the date of the current game 
    for (let i = 0;i<referee_in_matches.length;i++){
        if(referee_in_matches[i].match_date.getYear() == date_future_match.getYear() &&
        referee_in_matches[i].match_date.getMonth() == date_future_match.getMonth() &&
        referee_in_matches[i].match_date.getDay() == date_future_match.getDay()){
            return 0;
        }
    }
    await DButils.execQuery(
      `update dbo.matches set second_line_referee = '${referee_id}' where match_id = '${match_id}'`
    );
    return 1;
  }

  exports.getRFA = getRFA; /////////////////change
  exports.addMainRefereeToMatch = addMainRefereeToMatch;
  exports.addFirstLineRefereeToMatch = addFirstLineRefereeToMatch;
  exports.addSecondLineRefereeToMatch = addSecondLineRefereeToMatch;