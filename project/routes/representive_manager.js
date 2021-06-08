var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const referee_utils = require("./utils/referee_utils");
const teams_utils = require("./utils/teams_utils");
const matches_utils = require("./utils/matches_utils.js");
const league_utils = require("./utils/league_utils.js");
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



////////////////////changeeeeee 
router.post("/addMainRefereeToMatch", async (req, res, next) => {

    try {
        ///check if there is a referee
        const referee = await referee_utils.getReferee(req.body.userName);

        if (referee.length == 0) {
            throw { status: 401, message: "Referee does not exist" };
        }

        if (referee[0].type != "main referee") {
            throw { status: 404, message: "It is not possible to place a referee because he does not have the appropriate certification" };
        }

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

        if (match[0].main_referee != null) {
            throw { status: 401, message: "There is already a main referee to this match" };
        }

        if (match[0].first_line_referee == referee[0].referee_id || match[0].second_line_referee == referee[0].referee_id) {
            throw { status: 401, message: "The referee is already refereeing in this match" };
        }

        // const referee_id = req.session.userName;
        const match_id = req.body.match_id;

        const result = await representive_manager_utils.addMainRefereeToMatch(referee[0].referee_id, match_id);
        if (result == 0)
            throw { status: 401, message: "referee cannot be in two matches in same day" };
        res.status(201).send(req.body.userName + " was add successfully to the match");
    } catch (error) {
        next(error);
    }
});


router.post("/addFirstLineRefereeToMatch", async (req, res, next) => {

    try {
        ///check if there is a referee
        const referee = await referee_utils.getReferee(req.body.userName);

        if (referee.length == 0) {
            throw { status: 401, message: "Referee does not exist" };
        }

        if (referee[0].type != "linesman") {
            throw { status: 404, message: "It is not possible to place a referee because he does not have the appropriate certification" };
        }

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

        if (match[0].first_line_referee != null) {
            throw { status: 401, message: "There is already a first line referee to this match" };
        }

        if (match[0].first_line_referee == referee[0].referee_id || match[0].second_line_referee == referee[0].referee_id) {
            throw { status: 401, message: "The referee is already refereeing in this match" };
        }

        // const referee_id = req.session.userName;
        const match_id = req.body.match_id;

        const result = await representive_manager_utils.addFirstLineRefereeToMatch(referee[0].referee_id, match_id);
        if (result == 0)
            throw { status: 401, message: "referee cannot be in two matches in same day" };
        res.status(201).send(req.body.userName + " was add successfully to the match");
    } catch (error) {
        next(error);
    }
});


router.post("/addSecondLineRefereeToMatch", async (req, res, next) => {

    try {
        ///check if there is a referee
        const referee = await referee_utils.getReferee(req.body.userName);

        if (referee.length == 0) {
            throw { status: 401, message: "Referee does not exist" };
        }

        if (referee[0].type != "linesman") {
            throw { status: 404, message: "It is not possible to place a referee because he does not have the appropriate certification" };
        }

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

        if (match[0].second_line_referee != null) {
            throw { status: 401, message: "There is already a second line referee to this match" };
        }

        if (match[0].first_line_referee == referee[0].referee_id || match[0].second_line_referee == referee[0].referee_id) {
            throw { status: 401, message: "The referee is already refereeing in this match" };
        }

        // const referee_id = req.session.userName;
        const match_id = req.body.match_id;

        const result = await representive_manager_utils.addSecondLineRefereeToMatch(referee[0].referee_id, match_id);
        if (result == 0)
            throw { status: 401, message: "referee cannot be in two matches in same day" };
        res.status(201).send(req.body.userName + " was add successfully to the match");
    } catch (error) {
        next(error);
    }
});


router.get("/setMatches/:LeagueId", async (req, res, next) => {
    try {

        const teams_details = await teams_utils.getTeams(req.params.LeagueId);
        const match_policy = await league_utils.getLeaguePolicy(req.params.LeagueId);
        if (match_policy[0].matchesPolicy == 1) {
            await setByPolicy(1, teams_details);
        }
        else {
            await setByPolicy(0, teams_details);
        }
        res.send(200);
    } catch (error) {
        next(error);
    }
});

async function setByPolicy(start_index, teams_details) {
    var date = new Date();
    var year = date.getFullYear();
    var dateMonth = date.getMonth() + 1;
    var month = 9;
    if (dateMonth > month) {
        year = year + 1;
    }
    var hours = 19;
    var match_date = new Date(year, month - 1, date.getDate(), hours, 0, 0, 0);
    var stadium;
    var home_team;
    var out_team;
    var index_home;
    var index_out;
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
                await matches_utils.setMatch(home_team, out_team, mySQLDateString2, stadium);
            }
        }
    }
}
module.exports = router;
