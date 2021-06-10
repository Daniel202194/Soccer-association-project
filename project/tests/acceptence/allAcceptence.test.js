const session = require('supertest-session');
const app = require('../../main');
const DButils = require("../../routes/utils/DButils");
let sessionTest = null;

beforeEach( function() {
     sessionTest = session(app);
});
//************************************ login *********************************** */
async function aaaa(){
    await sessionTest.post("/Login").send({
        username: "daniel",
        password: "daniel",
    });
}

async function afterEachLogin() {
    await sessionTest.post("/Logout");
}

describe('Tests to UC Login', () => {
    jest.setTimeout(10000);
    test('Login successful', async () => {
        const res = await sessionTest.post("/Login").send({
            username: "daniel",
            password: "daniel",
        });
        expect(res.status).toBe(200);
        await afterEachLogin();
    });

    test('Login failed', async () => {
        const res = await sessionTest.post("/Login")
        .send({
            username: "dfsdf",
            password: "fdsfsd",
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe("Username or Password incorrect");
        await afterEachLogin();
    });

    test('Login failed', async () => {
        const res = await sessionTest.post("/Login")
        .send({
            username: "daniel",
            password: "fdsfsd",
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe("Username or Password incorrect");
    });
     
});

//************************************ placement Of Matches *********************************** */
async function afterEachMatch1(){
    await DButils.execQuery(
        `delete from dbo.matches where league_id = 2 and season_name = '2022-2023'`
    );
}

async function afterEachMatch2(){
    await DButils.execQuery(
        `delete from dbo.matches where league_id = 2 and season_name = '2025-2026'`
    );
}

describe('Tests to UC Match Placement', () => {
    jest.setTimeout(10000);
    test('Match placement was successful - polisy 1', async () => {
        await aaaa();
         await sessionTest.post('/representive_manager/setMatches') 
        .send({
            LeagueId: "2",
            SeasonName: "2022-2023"        
        })
        .expect(201);
        await afterEachMatch1();
    });

    test('Match placement was successful - polisy 2', async () => {
        await aaaa();
         await sessionTest.post('/representive_manager/setMatches') 
        .send({
            LeagueId: "2",
            SeasonName: "2025-2026"        
        })
        .expect(201);
        await afterEachMatch2();
    });

    test('Match placement was failure- No policy for the season', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/setMatches') 
        .send({
            LeagueId: "3",
            SeasonName: "2022-2023"        
        })
        expect(ans.status).toEqual(400);
        expect(ans.text).toEqual("No policy for the season");
    });

    test('Match placement was failure- the matches have already been calendered', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/setMatches') 
        .send({
            LeagueId: "1",
            SeasonName: "2022-2023"        
        })
        expect(ans.status).toEqual(400);
        expect(ans.text).toEqual("the matches have already been calendered");
    });

    test('Match placement was failure- Couldn not organize match!', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/setMatches') 
        .send({
            LeagueId: "3",
            SeasonName: "2021-2022"        
        })
        expect(ans.status).toEqual(400);
        expect(ans.text).toEqual("Couldn't organize match!");
    });
});

//************************************ placement Of Referees *********************************** */

async function afterEachReferee() {
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 126`
    );
   //Logout();
   sessionTest = null;

}

describe('Tests to UC Referee Placement', () => {
    jest.setTimeout(10000);
    test('Referee placement was successful', async () => {
        await aaaa();
         await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
                mainUserName: "referee_13",
                firstUserName: "referee_14",
                secondUserName: "referee_15",
                match_id: 126          
            })
            .expect(201);
            await afterEachReferee();
    });

    test('It is not possible to place a referee because he does not have the appropriate certification', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_13",
            secondUserName: "referee_15",
            match_id: 126              
        });
        expect(ans.status).toEqual(404);
        expect(ans.text).toEqual("It is not possible to place a referee because he does not have the appropriate certification");
   
    });

    test('It is not possible to place a referee because he does not have the appropriate certification -2 ', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_15",
            firstUserName: "referee_13",
            secondUserName: "referee_14",
            match_id: 126              
        })
        expect(ans.status).toEqual(404);
        expect(ans.text).toEqual("It is not possible to place a referee because he does not have the appropriate certification");
   
    });
    
    test('One of the referees does not exist', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_77",
            firstUserName: "referee_13",
            secondUserName: "referee_14",
            match_id: 126              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("One of the referees does not exist");
   
    });

    test('Can not choose same line referee', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_14",
            secondUserName: "referee_14",
            match_id: 125              
        })
        expect(ans.status).toEqual(404);
        expect(ans.text).toEqual("Can not choose same line referee");
    });

    test('match has already been played', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_14",
            secondUserName: "referee_15",
            match_id: 125              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("match has already been played");
    });

    test('match does not exist', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_14",
            secondUserName: "referee_15",
            match_id: 340              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("match does not exist");
    });

    test('There is already placed referee to this match', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_14",
            secondUserName: "referee_15",
            match_id: 124              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("There is already placed referee to this match");
    });

    test('main referee cannot be in two matches in same day', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_10",
            firstUserName: "referee_17",
            secondUserName: "referee_18",
            match_id: 138              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("main referee cannot be in two matches in same day");
    });

    test('first line referee cannot be in two matches in same day', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_13",
            firstUserName: "referee_14",
            secondUserName: "referee_18",
            match_id: 138
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("first line referee cannot be in two matches in same day");
    });

    test('second line referee cannot be in two matches in same day', async () => {
        await aaaa();
        const ans = await sessionTest.post('/representive_manager/addRefereesToMatch') 
        .send({
            mainUserName: "referee_16",
            firstUserName: "referee_17",
            secondUserName: "referee_15",
            match_id: 138              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("second line referee cannot be in two matches in same day");
    });
});