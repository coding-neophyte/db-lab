const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const ballTeams = require('./ball-teams.js');
const { categories } = require('./categories.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
          [user.email, hash]);
      })
    );

    const user = users[0].rows[0];

    await Promise.all(
      categories.map(category => {
        return client.query(`
                    INSERT INTO categories (category_name)
                    VALUES ($1);
                `,
          [category.category_name]);
      })
    );

    await Promise.all(
      ballTeams.map(team => {
        return client.query(`
                    INSERT INTO ball_teams (name, city, logo, championships, category_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
          [team.name, team.city, team.logo, team.championships, team.category_id, user.id]);
      })
    );




    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
