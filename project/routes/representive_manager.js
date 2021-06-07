var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const representive_manager_utils = require("./utils/representive_manager_utils");



router.use(async function (req, res, next) {
    if (req.session && req.session.user_id) {
      await manager_utils.getManager()
        .then((manager) => {
          if (manager.user_id == req.session.user_id) {
            next();
          }
          else 
            res.status(401).send("You don't have manager permissions");
        }).catch((err) => next(err));
    } else {
      res.status(401).send("unauthorized");
    }
  });



   ////////////////////changeeeeee
router.post("/addRefereeToMatch", async (req, res, next) => {

    try {
        ///check if there is a referee
        const referee = (
            await DButils.execQuery(
              `SELECT * FROM dbo.referee WHERE referee_id = '${req.body.user_id}'`
            )
        )[0];
        
        if (!referee) {
            throw { status: 401, message: "Referee does not exist" };
        }

        const match = (
            await DButils.execQuery(
              `SELECT * FROM dbo.matches WHERE match_id = '${req.body.match_id}'`
            )
        )[0];

        if (!match) {
            throw { status: 401, message: "match does not exist" };
        }

        const referee_id = req.session.user_id;
        const match_id = req.body.match_id;

        const result = await representive_manager_utils.addRefereeToMatch(referee_id, match_id);
        if (result==null)
            throw { status: 401, message: "referee cannot be in two matches in same day" };
        res.status(201).send(referee.username + " was add successfully to the match");
      } catch (error) {
        next(error);
      }
  });

  module.exports = router;
