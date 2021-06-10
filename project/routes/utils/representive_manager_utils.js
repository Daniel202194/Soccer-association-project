const DButils = require("./DButils");
const matches_utils = require("./matches_utils.js");

/**
 * 
 * @returns our representive football association - daniel
 */
async function getRFA() {
    const rfa = await DButils.execQuery(
        `select username from dbo.users where username = 'daniel'`
    );
    return rfa[0];
}

/**
 * the function insert 3 referees to a match in case of all referees are available, there are referees, and the 
 * user inserted 3 different referees
 * @param {*} main_referee_id 
 * @param {*} first_line_referee_id 
 * @param {*} second_line_referee_id 
 * @param {*} match_id 
 * @returns 0 - the main referee is in other game
 *          1 - the first line referee is in other game  
 *          2 - the second line referee is in other game
 *          3 - all the referees was inserted to a match
 */
async function addRefereesToMatch(main_referee_id, first_line_referee_id, second_line_referee_id, match_id) {

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
        return { status: 401, message: "match does not exists!" };
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
    return 3; ///all data was inserted to matches
}


/**
 * the function checks if referee can referee at that date of a match
 * @param {*} match_date can not be null or empty value
 * @param {*} date_future_match can not be null or empty value
 * @returns true - if the referee is busy at this day (he is working in another match)
 *          false - he is available to referee
 */
async function isRefereeBusy(match_date, date_future_match) {
    if (match_date == null || date_future_match == null || match_date == '' || date_future_match == '')
        return "Missing field, make sure you entered: match in type match and date_future_match in type Date";

    if (date_future_match instanceof Date && match_date instanceof Date && !isNaN(match_date.getTime()) && !isNaN(date_future_match.getTime())) {
        if (match_date.getFullYear() == date_future_match.getFullYear() && match_date.getMonth() == date_future_match.getMonth() &&
            match_date.getDate() == date_future_match.getDate()) {
            return true; ///the referee is busy
        }
    }
    else
        return "make sure you entered: date_future_match in type Date";
    return false; ///the referee is available

}


/**
 * the function check the policy of a specific league in specific season and insert to 'matches' matches once a
 * week and releted to policy (policy 1 - one match between two teams, policy 2 - two match between two teams)
 * @param {*} start_index can not be null or empty value
 * @param {*} teams_details can not be null or empty value
 * @param {*} leegue_id can not be null or empty value
 * @param {*} season_name can not be null or empty value
 * @returns 200 - all values are correct and matches were inserted at current policy
 *  400 - some of the values incorrect
 * 
 */
async function setByPolicy(start_index, teams_details, leegue_id, season_name) {
    if (start_index === '' || teams_details === null || teams_details === '' || leegue_id === '' || leegue_id === null || season_name === '' || season_name === null
        || start_index === null)
        return 400; ///one of the params is null or empty
    if (typeof season_name === 'string') {
        years = season_name.split('-');
        if (parseInt(years[0]) != years[0] || parseInt(years[1]) != years[1] || parseInt(years[0]) + 1 != parseInt(years[1]))
            return 400; ///years are not consecutive or years are not type of integer
    }
    else{
        return 400; ///season_name is not type of string
    }


    let season_year = season_name.substring(0, 4);
    var date = new Date();
    var current_year = date.getFullYear();
    if (parseInt(season_year) < current_year) {
        return 400;
    }
    var dateMonth = date.getMonth() + 1;
    var month = 5;
    if (dateMonth > month && parseInt(season_year) <= current_year) {
        return 400;
        //current_year = current_year + 1;
    }
    var hours = 19;
    var match_date = new Date(current_year, month - 1, date.getDate(), hours, 0, 0, 0);
    var stadium, home_team, out_team, index_home, index_out;
    for (index_home = 0; index_home < teams_details.length; index_home++) {
        if (start_index == 0) {
            end_index = index_home;
        }
        else {
            end_index = 0;
        }
        var res = 200;
        for (index_out = index_home + start_index - end_index; index_out < teams_details.length; index_out++) {
            if (index_home != index_out) {

                var match_date = new Date(match_date.getTime() + (7 * 24 * 60 * 60 * 1000));
                //const mySQLDateString2 = match_date.toJSON().slice(0, 19);
                if (index_out % 2 == 0 || start_index == 0) {
                    home_team = teams_details[index_home].team_id;
                    out_team = teams_details[index_out].team_id;
                    stadium = teams_details[index_home].stadium;
                }
                else {
                    home_team = teams_details[index_out].team_id;
                    out_team = teams_details[index_home].team_id;
                    stadium = teams_details[index_out].stadium;
                }
                res = await matches_utils.setMatch(home_team, out_team, match_date, stadium, season_name, leegue_id);
            }
        }
    }
    return res;
}


exports.getRFA = getRFA;
exports.addRefereesToMatch = addRefereesToMatch;

//for the test
exports.isRefereeBusy = isRefereeBusy;
exports.setByPolicy = setByPolicy;