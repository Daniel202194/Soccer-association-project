const session = require('supertest-session');
const { response } = require('../../main');
const app = require('../../main')
const DButils = require("../../routes/utils/DButils");
let sessionTest = null;

beforeEach(function(){
    sessionTest = session(app);
});

// async function a(){
//     const res = await request(app)
//     .post('/Login')
//     .send({
//       username: "daniel",
//       password: "daniel",
//     });
//     return res;
// }

async function aaaa(){
    await sessionTest.post("/Login").send({
        username: "daniel",
        password: "daniel",
    });
}



async function Logout(){
    await sessionTest.post("/Logout");
}

afterEach(async() => {
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 126`
    );
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 125`
    );
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 119`
    );
   Logout();
   sessionTest = null;

});


describe('Tests to UC Referee Placement', () => {

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

    // test('Can not choose same line referee', async () => {
    //     await aaaa();
    //     const ans = await sessionTest.get('/representive_manager/setMatches/:LeagueId/:SeasonName') 
    //     .send({
    //         mainUserName: "referee_13",
    //         firstUserName: "referee_14",
    //         secondUserName: "referee_14",
    //         match_id: 126              
    //     })
    //     expect(ans.status).toEqual(404);
    //     expect(ans.text).toEqual("Can not choose same line referee");
    // });

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
            firstUserName: "referee_14",
            secondUserName: "referee_15",
            match_id: 119              
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
            secondUserName: "referee_15",
            match_id: 119              
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
            match_id: 119              
        })
        expect(ans.status).toEqual(401);
        expect(ans.text).toEqual("second line referee cannot be in two matches in same day");
    });
});