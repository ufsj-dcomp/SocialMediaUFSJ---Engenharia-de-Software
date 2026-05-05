const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const { Router } = require("express");
const knex = require("knex");
const config = require("../knexfile.js");
const db = knex(config.development);
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        cb(null, Date.now() + extensao); 
    }
});
const upload = multer({ storage: storage });

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

router.get("/api/usuario/estudantes", async (req, res) => {
    try {
        const estudantes = await db('usuario').select('email', 'nome');
        res.status(200).json(estudantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar estudantes" });
    }
});

router.post("/api/usuario/promover-administrador-curso", async (req, res) => {
    const { email, curso } = req.body;

    if (!email || !curso) {
        return res.status(400).json({ error: "E-mail e curso são obrigatórios." });
    }

    try {
        await db.transaction(async (trx) => {

            await trx('usuario')
                .where({ email: email })
                .update({ eh_administrador_curso: 1 });

            const relacaoExiste = await trx('administrador_curso_relacao')
                .where({ 
                    email: email, 
                    curso_nome: curso 
                }).first();

            if (!relacaoExiste) {
                await trx('administrador_curso_relacao').insert({
                    email: email,
                    curso_nome: curso
                });
            }
        });

        res.status(200).json({ message: "Administrador de curso promovido com sucesso!" });

    } catch (error) {
        console.error("Erro ao promover admin de curso:", error);
        
        if (error.message === "USUARIO_NAO_ENCONTRADO") {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_NO_REFERENCED_ROW') {
            return res.status(400).json({ error: "O curso selecionado não existe no banco de dados." });
        }

        res.status(500).json({ error: "Erro interno no servidor ao tentar promover o administrador." });
    }
});


router.get("/api/usuario/:email", async (req, res) => {
    try {
        const user = await db('usuario').where({ email: req.params.email }).first();
        if (user) {
            res.json({ 
                eh_perfil_completo: Boolean(user.eh_perfil_completo),
                eh_administrador_geral: Boolean(user.eh_administrador_geral),
                eh_administrador_curso: Boolean(user.eh_administrador_curso),
                foto: user.foto 
            });
        } else {
            res.json({ 
                eh_perfil_completo: false,
                eh_administrador_geral: false,
                eh_administrador_curso: false,
                foto: null
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro interno" });
    }
});


module.exports = router;