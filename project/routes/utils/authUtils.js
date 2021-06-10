const DButils = require("./DButils");

/**
 * Gets a username and checks if it exists in DB
 * @param {*} username 
 * @returns 
 */
async function existUsername(username) {
    if (username === null || username === "") {
        console.log("Username or Password incorrect")
        return 0;
    }
    const user = await DButils.execQuery(
        `SELECT * FROM dbo.users WHERE username = '${username}'`
    );
    if (user[0] != undefined) { //username do not exists
        return (user[0]);
    }
    return 0;

}

exports.existUsername = existUsername;

