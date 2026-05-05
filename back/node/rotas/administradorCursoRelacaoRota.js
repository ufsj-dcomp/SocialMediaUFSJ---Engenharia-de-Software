
const { Router } = require("express");
const knex = require("knex");
const config = require("../knexfile.js");
const db = knex(config.development);

const router = Router();

router.get("/api/administradores-curso", async (req, res) => {
    try {
        const administradores = await db('administrador_curso_relacao')
            .join('usuario', 'administrador_curso_relacao.email', '=', 'usuario.email')
            .join('cursos', 'administrador_curso_relacao.curso_nome', '=', 'cursos.nome')
            .select(
                'usuario.nome as admin_nome',
                'usuario.email as admin_email',
                'cursos.nome as curso_nome'
            );

        res.status(200).json(administradores);

    } catch (error) {
        console.error("Erro ao buscar administradores de curso:", error);
        res.status(500).json({ error: "Erro interno ao buscar a lista de administradores." });
    }
});

module.exports = router;