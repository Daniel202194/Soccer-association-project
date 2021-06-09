const session = require('supertest-session');
const { response } = require('../../main');
const app = require('../../main')
const DButils = require("../../routes/utils/DButils");
let sessionTest = null;

//let token;

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

afterEach(async() => {
    await DButils.execQuery(
        `update dbo.matches
         set main_referee = null , first_line_referee = null , second_line_referee = null 
         where match_id = 126`
    );
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
        .expect(201)
    });

    // test('Rechedule Match succeed', async () => {
    //     await aaaa();
    //     await sessionTest.post('/representive_manager/addRefereesToMatch') 
    //     .send({
    //         mainUserName: "referee_13",
    //         firstUserName: "referee_13",
    //         secondUserName: "referee_15",
    //         match_id: 126              
    //     })
    //     .expect(400)
    // });

    
});