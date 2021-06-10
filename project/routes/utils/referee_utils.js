const DButils = require("./DButils");

/**
 * 
 * @param {*} userName cn not be null or empty
 * @returns a referee object whose name is userName
 */
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
