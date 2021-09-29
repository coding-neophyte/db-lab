require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async () => {
      execSync('npm run setup-db');

      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });

      token = signInData.body.token; // eslint-disable-line
    }, 10000);

    afterAll(done => {
      return client.end(done);
    });

    test('returns basketball teams', async () => {

      const expectation = [
        {
          id: 1,
          name: 'knicks',
          city: 'new york',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1200px-New_York_Knicks_logo.svg.png',
          championships: 2,
          category: 'eastern conference',
          owner_id: 1
        },
        {
          id: 2,
          name: 'trailblazers',
          city: 'portland',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Portland_Trail_Blazers_logo.svg/1200px-Portland_Trail_Blazers_logo.svg.png',
          championships: 1,
          category: 'western conference',
          owner_id: 1
        },
        {
          id: 3,
          name: 'heat',
          city: 'miami',
          logo: 'https://blog.logomyway.com/wp-content/uploads/2021/07/miami-heat-logo.png',
          championships: 3,
          category: 'eastern conference',
          owner_id: 1
        },
        {
          id: 4,
          name: 'warriors',
          city: 'golden state',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/01/Golden_State_Warriors_logo.svg/1200px-Golden_State_Warriors_logo.svg.png',
          championships: 6,
          category: 'western conference',
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/basketball-teams')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns one basketball team', async () => {

      const expectation =
      {
        id: 1,
        name: 'knicks',
        city: 'new york',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1200px-New_York_Knicks_logo.svg.png',
        championships: 2,
        category: 'eastern conference',
        owner_id: 1
      };


      const data = await fakeRequest(app)
        .get('/basketball-teams/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
