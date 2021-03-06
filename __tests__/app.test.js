require('dotenv').config();

const { execSync } = require('child_process');
const { networkInterfaces } = require('os');

const fakeRequest = require('supertest');
const { createBrotliCompress } = require('zlib');
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
          id: expect.any(Number),
          name: expect.any(String),
          city: expect.any(String),
          logo: expect.any(String),
          championships: expect.any(Number),
          category_id: expect.any(Number),
          // owner_id: expect.any(Number),
          category_name: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          city: expect.any(String),
          logo: expect.any(String),
          championships: expect.any(Number),
          category_id: expect.any(Number),
          // owner_id: expect.any(Number),
          category_name: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          city: expect.any(String),
          logo: expect.any(String),
          championships: expect.any(Number),
          category_id: expect.any(Number),
          // owner_id: expect.any(Number),
          category_name: expect.any(String)
        },
        {
          id: expect.any(Number),
          name: expect.any(String),
          city: expect.any(String),
          logo: expect.any(String),
          championships: expect.any(Number),
          category_id: expect.any(Number),
          // owner_id: expect.any(Number),
          category_name: expect.any(String)
        }
      ];



      const data = await fakeRequest(app)
        .get('/basketball-teams')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('gets one team from data', async () => {

      const expectation =
      {
        id: 1,
        name: 'knicks',
        city: 'new york',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/25/New_York_Knicks_logo.svg/1200px-New_York_Knicks_logo.svg.png',
        championships: 2,
        category_id: 1,
        // owner_id: 1,
        category_name: 'eastern conference'
      };


      const data = await fakeRequest(app)
        .get('/basketball-teams/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('adds a new team', async () => {

      const expectation =
      {
        id: expect.any(Number),
        name: 'celtics',
        city: 'boston',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
        championships: 17,
        // category_name: 'eastern conference',
        category_id: 1,
        owner_id: 1
      };


      const data = await fakeRequest(app)
        .post('/basketball-teams')
        .send({
          name: 'celtics',
          city: 'boston',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
          championships: 17,
          category_name: 'eastern conference',
          category_id: 1,
          owner_id: 1
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('updates a team data', async () => {

      const expectation =
      {
        id: expect.any(Number),
        name: 'celtics',
        city: 'boston',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
        championships: 17,
        // category_name: 'eastern conference',
        category_id: 1,
        owner_id: 1
      };


      const data = await fakeRequest(app)
        .put('/basketball-teams/5')
        .send({
          name: 'celtics',
          city: 'boston',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
          championships: 17,
          category_id: 1,
          // category_name: 'eastern conference',
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('deletes a team from data', async () => {

      const expectation =
      {
        id: expect.any(Number),
        name: 'celtics',
        city: 'boston',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
        championships: 17,
        category_id: 1,
        owner_id: 1
      };


      const data = await fakeRequest(app)
        .delete('/basketball-teams/5')
        .send({
          name: 'celtics',
          city: 'boston',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/1200px-Boston_Celtics.svg.png',
          championships: 17,
          category_id: 1,
          category_name: 'eastern conference'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    //testing the category routes

    test('should return categories', async () => {
      const expected = [
        {
          id: expect.any(Number),
          category_name: expect.any(String),
        },
        {
          id: expect.any(Number),
          category_name: expect.any(String)
        }

      ];

      const data = await fakeRequest(app)
        .get('/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expected);
    });


    test('should create a new category', async () => {
      const expected =
      {
        id: expect.any(Number),
        category_name: expect.any(String),
      };


      const data = await fakeRequest(app)
        .post('/categories')
        .send({

          id: expect.any(Number),
          category_name: expect.any(String),

        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expected);
    });

  });
});
