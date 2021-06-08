const request = require('supertest')
const app = require('../../main')
//const request = supertest(main)


describe('Tests to UC Referee Placement', () => {

    test('Referee placement was successful', async () => {
        await request(app).post('/representive_manager/addRefereesToMatch')
            .send({
                mainUserName: "referee_22",
                firstUserName: "referee_23",
                secondUserName: "referee_24",
                match_id: "88"           
            })
            .expect(201)
    });

    // test('Rechedule Match succeed', async () => {
    //     await request.post('/rescheduleMatch')
    //         .send({
    //             "season": "league1_2021",
    //             "home_team": "hapoel tel aviv",
    //             "away_team": "macabi haifa",
    //             "new_date": "2020-07-21T20:00:00.000+00:00",
    //             "new_stadium": "blumfield"            
    //         })
    //         .expect(400)
    // });

    
});