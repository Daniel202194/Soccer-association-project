const DButils = require("./DButils");

async function getRFA() {
    const rfa = await DButils.execQuery(
        `select username from dbo.users where username = 'daniel'`
    );
    return rfa[0];
}

async function addRefereesToMatch(main_referee_id, first_line_referee_id, second_line_referee_id, match_id) {
    ///get all matches the referee is in 
    let sw = isRefereeBusy("sdf", "ttt");
    const referee_in_matches = await DButils.execQuery(
        `select match_id,match_date,main_referee,first_line_referee,second_line_referee from dbo.matches where 
        main_referee = '${main_referee_id}' OR first_line_referee = '${first_line_referee_id}' OR second_line_referee = '${first_line_referee_id}'
        OR first_line_referee = '${second_line_referee_id}' OR second_line_referee = '${second_line_referee_id}'`
    );
    ////get the date of the match that the representator want to add the referee there
    const date_future_match = await DButils.execQuery(
        `select match_date from dbo.matches where match_id = '${match_id}'`
    );

    if (date_future_match.length == 0) {
        return -1;
    }
    ////get all the games that the referee in there and collide in the date of the current game 
    for (let i = 0; i < referee_in_matches.length; i++) {
        if (await isRefereeBusy(referee_in_matches[i].match_date, date_future_match[0].match_date) === true) {
            if (referee_in_matches[i].main_referee == main_referee_id)
                return 0; ////the main referee is in other game
            else if (referee_in_matches[i].first_line_referee == first_line_referee_id || referee_in_matches[i].first_line_referee == second_line_referee_id)
                return 1;  ////the first line referee is in other game          
            else
                return 2;  ////the second line referee is in other game
        }
    }
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = '${main_referee_id}', first_line_referee = '${first_line_referee_id}', second_line_referee = '${second_line_referee_id}'
         where match_id = '${match_id}'`
    );
    return 3;
}

async function isRefereeBusy(match_date, date_future_match) {
    if (match_date == null || date_future_match == null || match_date == '' || date_future_match == '')
        return "Missing field, make sure you entered: match in type match and date_future_match in type Date";

    if (date_future_match instanceof Date && match_date instanceof Date && !isNaN(match_date.getTime()) && !isNaN(date_future_match.getTime())) {
        if (match_date.getFullYear() == date_future_match.getFullYear() && match_date.getMonth() == date_future_match.getMonth() &&
            match_date.getDate() == date_future_match.getDate()) {
            return true;
        }
    }
    else
        return "make sure you entered: date_future_match in type Date";
    return false;

}





exports.getRFA = getRFA;
exports.addRefereesToMatch = addRefereesToMatch;

//for the test
exports.isRefereeBusy = isRefereeBusy;