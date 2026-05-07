exports.up = function(knex) {
  return knex.schema.createTable('materias', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    
    // A coluna que fará a relação com o curso
    table.string('curso_nome').notNullable(); 
    
    table.string('local').notNullable();
    table.string('professor_atual').notNullable();
    table.string('periodo').notNullable();
    table.integer('carga_horaria').notNullable();
    table.string('horario').notNullable();
    
    // Chave estrangeira referenciando a chave primária 'nome' da tabela 'cursos'
    table.foreign('curso_nome')
         .references('nome')
         .inTable('cursos')
         .onDelete('CASCADE');
    
    // Critério: Impedir criação de matérias com nomes já cadastrados no mesmo curso
    table.unique(['nome', 'curso_nome']); 
    
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('materias');
};