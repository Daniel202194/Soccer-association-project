const DButils = require("./DButils");

async function getReferee(userName) {
    const referee = (
        await DButils.execQuery(
          `SELECT referee_id,type FROM dbo.referee WHERE username = '${userName}'`
        )
    );
    
  return referee;
}

exports.getReferee = getReferee;