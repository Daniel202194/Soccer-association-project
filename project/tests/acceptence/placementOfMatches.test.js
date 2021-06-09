const session = require('supertest-session');
const app = require('../../main')
//const DButils = require("../../routes/utils/DButils");
let sessionTest = session(app);

// beforeEach(function()  {
//     sessionTest = session(app);
// });

// async function aaaa(){
//     await sessionTest.post("/Login").send({
//         username: "daniel",
//         password: "daniel",
//     });
// }
afterAll(async() => {
    // await DButils.execQuery(
    //     `update dbo.matches
    //      set main_referee = null , first_line_referee = null , second_line_referee = null 
    //      where match_id = 126`
    // );
  // Logout();
   sessionTest = null;

});

// async function Logout(){
//     await sessionTest.post("/Logout");
// }



// async function delet_me(){
//     await DButils.execQuery(
//         `delete from dbo.matches where league_id = 2 and season_name = '2022-2023'`
//     );
// }


describe('Tests to UC Login', () => {
    // test('Login successful', async () => {
    //     const res = await sessionTest.post("/Login").send({
    //         username: "daniel",
    //         password: "daniel",
    //     });
    //     expect(res.status).toBe(200);
    // });

    test('Login failed', async () => {
        const res = await sessionTest.post("/Login")
        .send({
            username: "dfsdf",
            password: "fdsfsd",
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe("Username or Password incorrect");
    });

    // test('Login failed', async () => {
    //     const res = await sessionTest.post("/Login")
    //     .send({
    //         username: "daniel",
    //         password: "fdsfsd",
    //     });
    //     expect(res.status).toBe(401);
    //     expect(res.text).toBe("Username or Password incorrect");
    // });
    
    
});

// describe('Tests to UC Player Placement', () => {
//     jest.setTimeout(10000);
//     test('Player placement was successful', async () => {
//         await aaaa();
//          await sessionTest.post('/representive_manager/setMatches') 
//         .send({
//             LeagueId: "2",
//             SeasonName: "2022-2023"        
//         })
//         .expect(201);
//         await delet_me();
//     });

//     test('Player placement was failure- No policy for the season', async () => {
//         await aaaa();
//         const ans = await sessionTest.post('/representive_manager/setMatches') 
//         .send({
//             LeagueId: "3",
//             SeasonName: "2022-2023"        
//         })
//         expect(ans.status).toEqual(400);
//         expect(ans.text).toEqual("No policy for the season");
//     });

//     test('Player placement was failure- the matches have already been calendered', async () => {
//         await aaaa();
//         const ans = await sessionTest.post('/representive_manager/setMatches') 
//         .send({
//             LeagueId: "1",
//             SeasonName: "2022-2023"        
//         })
//         expect(ans.status).toEqual(400);
//         expect(ans.text).toEqual("the matches have already been calendered");
//     });

//     test('Player placement was failure- Couldn not organize match!', async () => {
//         await aaaa();
//         const ans = await sessionTest.post('/representive_manager/setMatches') 
//         .send({
//             LeagueId: "3",
//             SeasonName: "2021-2022"        
//         })
//         expect(ans.status).toEqual(400);
//         expect(ans.text).toEqual("Couldn't organize match!");
//     });
// });

