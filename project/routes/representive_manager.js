var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");

const referee_utils = require("./utils/referee_utils");
const teams_utils = require("./utils/teams_utils");
const matches_utils = require("./utils/matches_utils.js");
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
        // let r = new Date('2021-10-13');
        // const rest = await matches_utils.setMatch(1, 3, r, 'STADIUM_1', '2021-2022', 1);
        let iii = matches_utils.getMatch(121);
        const date_fut_msatcnnh = await DButils.execQuery(
            `delete from dbo.matches where league_id = 2 and season_name = '2022-2023'`
        );
        const j = await DButils.execQuery(
            `insert into seasons values (2,'2022-2023',1,1)`
        );
        const d = await DButils.execQuery(
            `select * from dbo.leagues where league_id = 3`
        );
        const a = await DButils.execQuery(
            `select * from dbo.seasons where season_name = '2021-2022'`
        );
        const vv = await DButils.execQuery(
            `insert into leagues values (3,'ligatHahal') `
        );
        const aa = await DButils.execQuery(
            `insert into seasons values (3,'2021-2022',1,2)`
        );
        // let x= new Date('2021-04-15');
        const date_dfut_match = await DButils.execQuery(
            `select * from dbo.matches where league_id = 2 and season_name = '2021-2022'`
        );

        const date_fut_matcah = await DButils.execQuery(
            `select * from dbo.matches where league_id = 2 and season_name = '2021-2022'`
        );
        // const t = await DButils.execQuery(
        //     `update matches 
        //     set match_date = '2021-04-15'
        //     where match_id = 125`
        // );
        //check if there is a referee
        const main_referee = await referee_utils.getReferee(req.body.mainUserName);
        const first_referee = await referee_utils.getReferee(req.body.firstUserName);
        const second_referee = await referee_utils.getReferee(req.body.secondUserName);

        if (main_referee.length == 0 || first_referee.length == 0 || second_referee.length == 0)
            throw { status: 401, message: "One of the referees does not exist" };

        if (main_referee[0].type != "main referee" || first_referee[0].type != "linesman" || second_referee[0].type != "linesman")
            throw { status: 404, message: "It is not possible to place a referee because he does not have the appropriate certification" };

        if (first_referee[0].referee_id == second_referee[0].referee_id)
            throw { status: 404, message: "Can not choose same line referee" };

        const match = await matches_utils.getMatch(parseInt(req.body.match_id));
        if (match.length == 0) {
            throw { status: 401, message: "match does not exist" };
        }
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        const date_today = today.toISOString().slice(0, 16).replace('T', ' ');
        const date_match = match[0].match_date.toISOString().slice(0, 16).replace('T', ' ');
        if (date_today > date_match) {
            throw { status: 401, message: "match has already been played" };
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
        else if (result == -1)
            throw { status: 401, message: "match does not exists!" };
        else
            res.status(201).send("Referees was add successfully to the match");

    } catch (error) {
        next(error);
    }
});

router.post("/setMatches", async (req, res, next) => {
    try {
        const aaw = await teams_utils.getTeams(1);
        var aaaa = await setByPolicy(1, aaw, 1, '2023-2024');

        const teams_details = await teams_utils.getTeams(req.body.LeagueId);
        const match_policy = await seasons_utils.getSeasonPolicy(req.body.SeasonName, req.body.LeagueId);
        if (match_policy.length == 0) {
            throw { status: 400, message: "No policy for the season" };
        }
        let season_name = req.body.SeasonName;
        const matches_by_season_and_league = await matches_utils.getMatchesByseason(season_name, req.body.LeagueId);
        if (matches_by_season_and_league.length > 0) {
            throw { status: 400, message: "the matches have already been calendered" };
        }
        var result;
        if (match_policy[0].matches_policy == 1) {
            result = await setByPolicy(1, teams_details, req.body.LeagueId, req.body.SeasonName);
        }
        else {
            result = await setByPolicy(0, teams_details, req.body.LeagueId, req.body.SeasonName);
        }
        if (result == 200)
            res.status(201).send("matches was added successfully!");
        else
            res.status(400).send("Couldn't organize match!");
    } catch (error) {
        next(error);
    }
});


// router.get("/setMatches/:LeagueId/:SeasonName", async (req, res, next) => {
//     try {
//         const teams_details = await teams_utils.getTeams(req.params.LeagueId);
//         const match_policy = await seasons_utils.getSeasonPolicy(req.params.SeasonName, req.params.LeagueId);
//         if (matches_policy.length == 0){
//             throw { status: 400, message: "No policy for the season" };
//         }
//         let season_name = req.params.SeasonName;
//         const matches_by_season_and_league = await matches_utils.getMatchesByseason(season_name, req.params.LeagueId);
//         if (matches_by_season_and_league.length > 0) {
//             throw { status: 400, message: "the matches have already been calendered" };
//         }
//         var result;
//         if (match_policy[0].matches_policy == 1) {
//             result = await setByPolicy(1, teams_details, req.params.LeagueId, req.params.SeasonName);
//         }
//         else {
//             result = await setByPolicy(0, teams_details, req.params.LeagueId, req.params.SeasonName);
//         }
//         if (result == 200)
//             res.status(201).send("matches was added successfully!");
//         else
//             res.status(400).send("Couldn't organize match!");
//     } catch (error) {
//         next(error);
//     }
// });

async function setByPolicy(start_index, teams_details, leegue_id, season_name) {
    // let season = await seasons_utils.getSeason(season_name);
    if (typeof season_name === 'string') {
        years = season_name.split('-');
        if (parseInt(years[0]) != years[0] || parseInt(years[1]) != years[1] || parseInt(years[0]) + 1 != parseInt(years[1]))
            return 400;
    }
    if (start_index === '' || teams_details === null || teams_details === '' || leegue_id === '' || leegue_id === null
        || start_index === null)
        return 400;
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
                res = await matches_utils.setMatch(home_team, out_team, match_date, stadium, season_name, leegue_id);
            }
        }
    }
    return res;
}
module.exports = router;
exports.setByPolicy = setByPolicy;