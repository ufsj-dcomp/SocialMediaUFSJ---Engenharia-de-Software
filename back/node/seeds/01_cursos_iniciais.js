exports.seed = async function(knex) {
  await knex('cursos').del();
  
  await knex('cursos').insert([
    { nome: 'Engenharia de Software' },
    { nome: 'Ciência da Computação' },
    { nome: 'Engenharia Elétrica' },
    { nome: 'Arquitetura e Urbanismo' },
    { nome: 'Medicina' },
    { nome: 'Engenharia Mecânica' },
    { nome: 'Letras' }
  ]);
};