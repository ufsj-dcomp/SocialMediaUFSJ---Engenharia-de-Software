exports.up = function(knex) {
  return knex.schema.createTable('usuario', table => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('nome').notNullable();
    table.string('nome_usuario').unique();
    table.string('curso');
    table.string('foto');
    table.boolean('eh_perfil_completo').defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuario');
};