const session = require('supertest-session');
const app = require('../../main')
//const DButils = require("../../routes/utils/DButils");
//let sessionTest = null;
let request = null;

// beforeEach(function(){
//     sessionTest = session(app);
// });

beforeEach(function(){
    request = session(app);
});

afterEach(function(){
    // Logout();
    request = null;
   // app.close();
    //request.exit();
    //session.close()

});





// async function Logout(){
//     await request.post("/Logout");
// }



describe('Tests to UC Login', () => {
    test('Login successful', async () => {
        const res = await request.post("/Login").send({
            username: "daniel",
            password: "daniel",
        });
        expect(res.status).toBe(200);
    });

    test('Login failed', async () => {
        const res = await request.post("/Login")
        .send({
            username: "dfsdf",
            password: "fdsfsd",
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe("Username or Password incorrect");
    });

    test('Login failed', async () => {
        const res = await request.post("/Login")
        .send({
            username: "daniel",
            password: "fdsfsd",
        });
        expect(res.status).toBe(401);
        expect(res.text).toBe("Username or Password incorrect");
    });
    
    
});