exports.up = function(knex) {
  return knex.schema.createTable('usuario', table => {
    table.string('email').notNullable().primary();
    table.string('nome').notNullable();
    table.string('nome_usuario').unique();
    table.string('curso');
    table.string('foto');
    table.boolean('eh_perfil_completo').defaultTo(false);
    table.timestamps(true, true);
    table.boolean('eh_administrador_geral').defaultTo(false);
    table.boolean('eh_administrador_curso').defaultTo(false);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('administrador_curso_relacao');
  await knex.schema.dropTableIfExists('usuario');
};