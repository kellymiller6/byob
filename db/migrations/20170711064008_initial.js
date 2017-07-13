exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('sports', function(table) {
      table.increments('id').primary();
      table.string('sport');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('covers', function(table) {
      table.increments('id').primary();
      table.string('date');
      table.string('sport');
      table.string('level');
      table.string('athlete');
      table.string('gender');
      table.integer('sport_id').unsigned()
      table.foreign('sport_id')
        .references('sports.id');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('covers'),
    knex.schema.dropTable('sports')
  ]);
};
