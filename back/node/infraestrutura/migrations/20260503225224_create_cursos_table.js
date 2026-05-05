exports.up = function(knex) {
  return knex.schema.createTable('cursos', table => {
    table.string('nome').primary();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cursos');
};