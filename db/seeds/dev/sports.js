const sportsData = require('../../../sports.json')

const createSport = (knex, sport) => {
  return knex('sports').insert({
    sport: sport.sport
  }, 'id')
  .then(sportId => {
    let coversPromises = [];

    sport.covers.forEach(cover => {
      coversPromises.push(
        createCovers(knex, {
          date: cover.date,
          sport: cover.sport,
          level: cover.level,
          athlete: cover.athlete,
          gender: cover.gender,
          sport_id: sportId[0]
        })
      )
    });
    return Promise.all(coversPromises);
  })
};

const createCovers = (knex, cover) => {
  return knex('covers').insert(cover);
};

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('covers').del()
    .then(() => knex('sports').del())
    .then(() => {
      let sportPromises = [];

      sportsData.forEach(sport => {
        sportPromises.push(createSport(knex, sport));
      });
      // Inserts seed entries
      return Promise.all(sportPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
