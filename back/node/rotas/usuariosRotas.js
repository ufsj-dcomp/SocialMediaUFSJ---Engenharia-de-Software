const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const { Router } = require("express");
const knex = require("knex");
const config = require("../knexfile.js");
const db = knex(config.development);
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post("/api/usuario/completar-perfil", upload.single('foto'), async (req, res) => {    
    const { email, usuario, curso, nome, foto_url } = req.body;

    const foto = req.file ? `${process.env.API_BASE_URL}/uploads/${req.file.filename}` : foto_url;
    try {
        const userExists = await db('usuario').where({ email }).first();

        if (userExists) {
            await db('usuario')
                .where({ email })
                .update({
                    nome_usuario: usuario,
                    curso: curso,
                    foto: foto,
                    eh_perfil_completo: true
                });
        } else {
            await db('usuario').insert({
                email,
                nome: nome,
                nome_usuario: usuario,
                curso: curso,
                foto: foto,
                eh_perfil_completo: true
            });
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno" });
    }
});

router.get("/api/usuario/:email", async (req, res) => {
    try {
        const user = await db('usuario').where({ email: req.params.email }).first();
        if (user) {
            res.json({ eh_perfil_completo: Boolean(user.eh_perfil_completo) });
        } else {
            res.json({ eh_perfil_completo: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
});

module.exports = router;