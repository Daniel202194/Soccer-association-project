const DButils = require("./DButils");

async function selectUsernames() {

    let users = (
        await DButils.execQuery("SELECT username FROM dbo.users")
    );
    return (users);
}

async function addUser(username, password, firstname, lastname, country, email, urlPic) {

    await DButils.execQuery(
        `INSERT INTO dbo.users (user_id, username, password, firstname, lastname, country, email, urlPic) 
        VALUES (default, '${username}', '${password}', '${firstname}', '${lastname}', '${country}', '${email}', '${urlPic}');`)  

}

async function findUser(username) {

    let user = (
        await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = '${username}'`)
    )[0];
    return (user);
}


  exports.selectUsernames = selectUsernames;
  exports.addUser = addUser;
  exports.findUser = findUser;

