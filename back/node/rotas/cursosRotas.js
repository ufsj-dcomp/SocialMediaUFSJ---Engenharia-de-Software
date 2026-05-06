
const { Router } = require("express");
const knex = require("knex");
const config = require("../knexfile.js");
const db = knex(config.development);

const router = Router();

router.get("/api/cursos", async (req, res) => {
    try {
        const cursos = await db('cursos').select('nome');
        res.status(200).json(cursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar cursos no banco de dados" });
    }
});

router.post('/', async (req, res) => {
    const { nome } = req.body;

    if (!nome || nome.trim() === '') {
        return res.status(400).json({ erro: 'O nome do curso é obrigatório.' });
    }

    try {
        const cursoExistente = await db('cursos').where({ nome }).first();
        
        if (cursoExistente) {
            return res.status(409).json({ erro: 'Já existe um curso cadastrado com este nome.' });
        }

        await db('cursos').insert({ nome });

        return res.status(201).json({ mensagem: 'Curso cadastrado com sucesso' });

    } catch (erro) {
        console.error('Erro ao cadastrar curso:', erro);
        return res.status(500).json({ erro: 'Erro interno no servidor ao tentar criar o curso.' });
    }
});

module.exports = router;