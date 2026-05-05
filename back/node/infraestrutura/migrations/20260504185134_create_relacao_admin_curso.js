exports.up = function(knex) {
  return knex.schema.createTable('administrador_curso_relacao', (table) => {
    table.string('email').notNullable();
    table.string('curso_nome').notNullable();

    table.foreign('email') 
         .references('email')          
         .inTable('usuario')
         .onDelete('CASCADE')
         .onUpdate('CASCADE');

    table.foreign('curso_nome')
         .references('nome')
         .inTable('cursos')
         .onDelete('CASCADE')
         .onUpdate('CASCADE');

    table.primary(['email', 'curso_nome']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('administrador_curso_relacao');
};