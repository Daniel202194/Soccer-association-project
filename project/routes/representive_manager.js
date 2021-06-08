var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const referee_utils = require("./utils/referee_utils");
const teams_utils = require("./utils/teams_utils");
const matches_utils = require("./utils/matches_utils.js");
const league_utils = require("./utils/league_utils.js");
const seasons_utils = require("./utils/seasons_utils.js");

const representive_manager_utils = require("./utils/representive_manager_utils");



router.use(async function (req, res, next) {
    if (req.session && req.session.username) {
        await representive_manager_utils.getRFA()
            .then((rfa) => {
                if (rfa.username == req.session.username) {
                    next();
                }
                else
                    res.status(401).send("You don't have RFA permissions");
            }).catch((err) => next(err));
    } else {
        res.status(401).send("unauthorized");
    }
});

router.post("/addRefereesToMatch", async (req, res, next) => {

    try {
        ///check if there is a referee
        const main_referee = await referee_utils.getReferee(req.body.mainUserName);
        const first_referee = await referee_utils.getReferee(req.body.firstUserName);
        const second_referee = await referee_utils.getReferee(req.body.secondUserName);

        if (main_referee.length == 0 || first_referee.length == 0 || second_referee.length == 0)
            throw { status: 401, message: "One of the referees does not exist" };

        if (main_referee[0].type != "main referee" || first_referee[0].type != "linesman" || second_referee[0].type != "linesman")
            throw { status: 404, message: "It is not possible to place a referee because he does not have the appropriate certification" };

        if (first_referee[0].referee_id == second_referee[0].referee_id)
            throw { status: 404, message: "Can not choose same line referee" };
        
        const match = await matches_utils.getMatch(req.body.match_id);
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const date_today = today.toISOString().slice(0, 16).replace('T', ' ');
        const date_match = new Date().toISOString().slice(0, 16).replace('T', ' ');

        if (date_today > date_match) {
            throw { status: 401, message: "match have already been played" };
        }
        if (match.length == 0) {
            throw { status: 401, message: "match does not exist" };
        }

        if (match[0].main_referee != null || match[0].first_line_referee != null || match[0].second_line_referee != null) {
            throw { status: 401, message: "There is already placed referee to this match" };
        }

        const match_id = req.body.match_id;
        const result = await representive_manager_utils.addRefereesToMatch(main_referee[0].referee_id, first_referee[0].referee_id, second_referee[0].referee_id, match_id);
        if (result == 0)
            throw { status: 401, message: "main referee cannot be in two matches in same day" };
        else if (result == 1)
            throw { status: 401, message: "first line referee cannot be in two matches in same day" };
        else if (result == 2)
            throw { status: 401, message: "second line referee cannot be in two matches in same day" };
        else
            res.status(201).send("Referees was add successfully to the match");
    } catch (error) {
        next(error);
    }
});


router.get("/setMatches/:LeagueId/:SeasonName", async (req, res, next) => {
    try {
        const teams_details = await teams_utils.getTeams(req.params.LeagueId);
        const match_policy = await seasons_utils.getSeasonPolicy(req.params.SeasonName, req.params.LeagueId);
        if (matches_policy.length == 0){
            throw { status: 400, message: "No policy for the season" };
        }
        let season_name = req.params.SeasonName;
        const matches_by_season_and_league = await matches_utils.getMatchesByseason(season_name, req.params.LeagueId);
        if (matches_by_season_and_league.length > 0) {
            throw { status: 400, message: "the matches have already been calendered" };
        }
        var result;
        if (match_policy[0].matches_policy == 1) {
            result = await setByPolicy(1, teams_details, req.params.LeagueId, req.params.SeasonName);
        }
        else {
            result = await setByPolicy(0, teams_details, req.params.LeagueId, req.params.SeasonName);
        }
        if (result == 200)
            res.status(201).send("matches was added successfully!");
        else
            res.status(400).send("Couldn't organize match!");
    } catch (error) {
        next(error);
    }
});

async function setByPolicy(start_index, teams_details, leegue_id, season_name) {
    // let season = await seasons_utils.getSeason(season_name);
    let season_year = season_name.substring(0, 4);
    var date = new Date();
    var current_year = date.getFullYear();
    if (season_year < current_year) {
        return 1;
    }
    var dateMonth = date.getMonth() + 1;
    var month = 9;
    if (dateMonth > month) {
        return 1;
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
        for (index_out = index_home + start_index - end_index; index_out < teams_details.length; index_out++) {
            if (index_home != index_out) {

                var match_date = new Date(match_date.getTime() + (7 * 24 * 60 * 60 * 1000));
                const mySQLDateString2 = match_date.toJSON().slice(0, 19);
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
                await matches_utils.setMatch(home_team, out_team, mySQLDateString2, stadium, season_name, leegue_id);
            }
        }
    }
    return 200;
}
module.exports = router;
