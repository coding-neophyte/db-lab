const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route.
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});


app.get('/basketball-teams', async (req, res) => {
  try {
    const data = await client.query(`SELECT
    ball_teams.id,
    ball_teams.name,
    ball_teams.championships,
    ball_teams.city,
    ball_teams.logo,
    ball_teams.category_id,
    categories.category_name
    FROM ball_teams
    JOIN categories
    ON ball_teams.category_id = categories.id`);

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/basketball-teams/:id', async (req, res) => {
  try {
    const data = await client.query(`SELECT
    ball_teams.id,
    ball_teams.name,
    ball_teams.championships,
    ball_teams.city,
    ball_teams.logo,
    ball_teams.category_id,
    categories.category_name
    FROM ball_teams
    JOIN categories
    ON ball_teams.category_id = categories.id
    where ball_teams.id=$1`, [req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/basketball-teams', async (req, res) => {
  try {
    const data = await client.query(`INSERT INTO ball_teams (name, city, logo, championships, category_id, owner_id)
    VALUES($1, $2, $3, $4, $5, $6)
    RETURNING *`, [req.body.name, req.body.city, req.body.logo, req.body.championships, req.body.category_id, 1]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/basketball-teams/:id', async (req, res) => {
  try {
    const data = await client.query(`UPDATE ball_teams
    SET name=$1, city=$2, logo=$3, championships=$4, category_id=$5, owner_id=$6
    WHERE id=$7
    RETURNING *`, [req.body.name, req.body.city, req.body.logo, req.body.championships, req.body.category_id, 1, req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.delete('/basketball-teams/:id', async (req, res) => {
  try {
    const data = await client.query(`DELETE FROM ball_teams
    WHERE id=$1
    Returning *`, [req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});
app.get('/categories', async (req, res) => {
  try {
    const data = await client.query('SELECT * from categories');

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});
app.post('/categories', async (req, res) => {
  try {
    const data = await client.query(`INSERT INTO categories (category_name)
    VALUES($1)
    RETURNING *`, [req.body.category_name]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});


app.use(require('./middleware/error'));

module.exports = app;
