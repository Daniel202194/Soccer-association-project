var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

var referee_id_counter = 1;
// router.post("/addReferees", async (req, res, next) => {
//   var type;
//   var j;
//   var i;
//   var referee_count;
//   referee_count = 1;
//   for(i = 0;i<8;i++){
//     for(j=0;j<3;j++){
//       if(j==0){
//         type = "main referee";
//       }
//       if(j==1 || j==2){
//         type = "linesman";
//       }
//       var userName = 'referee_' + referee_count.toString();
//       let hash_password = bcrypt.hashSync(
//         userName,
//         parseInt('11') //like env
//       );
//       await DButils.execQuery(
//         `INSERT INTO dbo.users (username, password, firstname, lastname, role) VALUES ('${userName}', '${hash_password}', '${userName}', '${userName}', 'referee')`
//       );

//       await DButils.execQuery(
//         `INSERT INTO dbo.referee (referee_id, username, type) VALUES ('${referee_id_counter}', '${userName}', '${type}' )`
//       );
//       referee_id_counter++;
//       referee_count++;
//     }
//   }
// });


// var coach_id_counter = 1;
// router.post("/addCoaches", async (req, res, next) => {
//   var i;
//   var j;
//   var coach_count;
//   coach_count = 1;
//   var type;
//   for(i = 0;i<8;i++){
//     var team_id = i + 1;
//     for(j = 0;j<2;j++){
//       var type;
//       if(j==0){
//         type = "main coach";
//       }
//       if(j==1){
//         type = "Goalkeeping coach";
//       }
//       var userName = 'coach_' + coach_count.toString();
//       let hash_password = bcrypt.hashSync(
//         userName,
//         parseInt('11') //like env
//       );
//       await DButils.execQuery(
//         `INSERT INTO dbo.users (username, password, firstname, lastname, role) VALUES ('${userName}', '${hash_password}', '${userName}', '${userName}', 'coach')`
//       );

//       await DButils.execQuery(
//         `INSERT INTO dbo.coaches (coach_id, username, team_id, type) VALUES ('${coach_id_counter}', '${userName}','${team_id}', '${type}' )`
//       );
//       coach_id_counter++;
//       coach_count++;
//     }
//   }
// });



// var player_id_counter = 1;
// router.post("/addPlayers", async (req, res, next) => {
//   var i;
//   var j;
//   var player_count;
//   player_count = 1;
//   var positon;
//   for(i = 0;i<8;i++){
//     var team_id = i + 1;
//     for(j = 0;j<11;j++){
//       if(j==0){
//         positon = "GK";
//       }
//       if(j==1 || j==2){
//         positon = "CB";
//       }
//       if(j==3){
//         positon = "LB";
//       }
//       if(j==4){
//         positon = "RB";
//       }
//       if(j==5 || j==6){
//         positon = "CM";
//       }
//       if(j==7){
//         positon = "LM";
//       }
//       if(j==8){
//         positon = "RM";
//       }
//       if(j==9 || j==10){
//         positon = "ST";   
//       }
//       var userName = 'player_' + player_count.toString();
//       let hash_password = bcrypt.hashSync(
//         userName,
//         parseInt('11') //like env
//       );
//       await DButils.execQuery(
//         `INSERT INTO dbo.users (username, password, firstname, lastname,role) VALUES ('${userName}', '${hash_password}', '${userName}', '${userName}', 'player')`
//       );

//       await DButils.execQuery(
//         `INSERT INTO dbo.players (player_id, username,birth_date,position,team_id) VALUES ('${player_id_counter}', '${userName}', '21-02-1994', '${positon}', '${team_id}')`
//       );
//       player_id_counter++;
//       player_count++;
//     }
//   }
// });
// router.post("/Register", async (req, res, next) => {
//   try {
  
//     const users = await DButils.execQuery(
//       "SELECT username FROM dbo.users"
//     );

//     if (users.find((x) => x.username === req.body.username))
//       throw { status: 409, message: "Username taken" };
  
//     //hash the password
//     let hash_password = bcrypt.hashSync(
//       req.body.password,
//       parseInt('11') //like env
//     );
//     req.body.password = hash_password;
    
//     // add the new username
//     await DButils.execQuery(
//       `INSERT INTO dbo.users (username, password, firstname, lastname,role) VALUES ('${req.body.username}', '${hash_password}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.role}')`
//     );
//     if(req.body.role == "coach"){
//       await DButils.execQuery(
//         `INSERT INTO dbo.coaches (coach_id, username,team_id,type) VALUES ('${coach_id_counter}', '${username}', '${req.body.team_id}', '${req.body.type}')`
//       );
//       coach_id_counter++;
//     }
//     else if (req.body.role == "referee"){
//       await DButils.execQuery(
//         `INSERT INTO dbo.referee (referre_id, username,type) VALUES ('${referee_id_counter}', '${username}', '${req.body.type}')`
//       );
//       referee_id_counter++;
//     }
//     else if (req.body.role == "player"){
//       await DButils.execQuery(
//         `INSERT INTO dbo.coaches (player_id, username,birth_date,positon,team_id) VALUES ('${player_id_counter}', '${username}', '${req.body.birth_date}', '${req.body.positon}', '${req.body.team_id}')`
//       );
//       player_id_counter++;
//     }
//     res.status(201).send("user created");
//   } catch (error) {
//     next(error);
//   }
// });




router.post("/Login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${req.body.username}'`
      )
    )[0];
    // user = user[0];
    console.log(user);

    // check that username exists & the password is correct
  
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.username = user.username;

    // return cookie
    res.status(200).send("login succeeded");
  } catch (error) {
    next(error);
  }
});

// router.post("/Logout", function (req, res) {
//   req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
//   res.send({ success: true, message: "logout succeeded" });
// });

module.exports = router;
