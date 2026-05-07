const express = require('express');
const router = express.Router();
const config = require('../knexfile');
const knex = require('knex')(config.development);


router.post('/', async (req, res) => {
  const { 
    nome, 
    curso_nome, 
    local, 
    professor_atual, 
    periodo, 
    carga_horaria, 
    horario 
  } = req.body;

  if (!nome || !curso_nome || !local || !professor_atual || !periodo || !carga_horaria || !horario) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  if (isNaN(carga_horaria) || carga_horaria <= 0) {
    return res.status(400).json({ erro: 'A carga horária deve ser um número válido e maior que zero.' });
  }

  try {
    const materiaExistente = await knex('materias')
      .where({ nome, curso_nome })
      .first();

    if (materiaExistente) {
      return res.status(409).json({ erro: 'Já existe uma matéria com este nome vinculada a este curso.' });
    }

    const [novaMateria] = await knex('materias').insert({
      nome,
      curso_nome,
      local,
      professor_atual,
      periodo,
      carga_horaria,
      horario
    }).returning('*'); 

    res.status(201).json({ 
      mensagem: 'Matéria cadastrada com sucesso!', 
      materia: novaMateria 
    });

  } catch (error) {
    console.error('Erro ao cadastrar matéria:', error);
    res.status(500).json({ erro: 'Erro interno ao cadastrar a matéria.', detalhes: error.message });
  }
});

module.exports = router;