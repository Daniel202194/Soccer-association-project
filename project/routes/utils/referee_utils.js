const DButils = require("./DButils");

async function getReferee(userName) {
  if(userName == null || userName == ""){
    return "Missing field, make sure you entered: userName";
  }
  const referee = (
      await DButils.execQuery(
        `SELECT referee_id ,type FROM dbo.referee WHERE username = '${userName}'`
      )
  );
  return referee;
}

exports.getReferee = getReferee;