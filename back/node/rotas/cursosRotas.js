
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

module.exports = router;