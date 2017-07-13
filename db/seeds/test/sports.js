const sportsData = [{
    "sport": "boxing",
    "id": 1,
    "covers":[{
        "id": 1,
        "date": "06132016",
        "sport": "boxing",
        "level": "pro",
        "athlete": "muhammad ali",
        "gender": "male",
        "sport_id": 1
    },
    {
        "id": 2,
        "date": "10052015",
        "sport": "boxing",
        "level": "pro",
        "athlete": "muhammad ali",
        "gender": "male",
        "sport_id": 1
    },
    {
        "id": 3,
        "date": "05042015",
        "sport": "boxing",
        "level": "pro",
        "athlete": "floyd mayweather, manny pacquiao",
        "gender": "male",
        "sport_id": 1
    }]
},
{
    "sport": "climbing",
    "id": 2,
    "covers":[{
        "id": 4,
        "date": "05082017",
        "sport": "climbing",
        "level": "pro",
        "athlete": "Jeff Glasbrenner",
        "gender": "male",
        "sport_id": 2
    }]
},
{
    "sport": "golf",
    "id": 3,
    "covers":[{
        "id": 5,
        "date": "06262017",
        "sport": "golf",
        "level": "pro",
        "athlete": "Brooks Koepka",
        "gender": "male",
        "sport_id": 3
    },
    {
        "id": 6,
        "date": "04172017",
        "sport": "golf",
        "level": "pro",
        "athlete": "sergio garcia",
        "gender": "male",
        "sport_id": 3
    }]
}]

const createSport = (knex, sport) => {
  return knex('sports').insert({
    sport: sport.sport,
   id: sport.id})
  .then(sportId => {
    let coversPromises = [];

    sport.covers.forEach(cover => {
      coversPromises.push(
        createCovers(knex, {
          id: cover.id,
          date: cover.date,
          sport: cover.sport,
          level: cover.level,
          athlete: cover.athlete,
          gender: cover.gender,
          sport_id: cover.sport_id
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
