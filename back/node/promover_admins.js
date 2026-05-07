const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const knex = require("knex");
const config = require("./knexfile.js");
const db = knex(config.development);

// Emais admin
const emailsAdmins = [
    "davysalgado01@aluno.ufsj.edu.br",
    "estermariasouza2005@aluno.ufsj.edu.br",
    "jmsilvapn@aluno.ufsj.edu.br"
];

async function definirAdmins() {
    try {
        const linhasAfetadas = await db('usuario')
            .whereIn('email', emailsAdmins)
            .update({
                eh_administrador_geral: true
            });

        if (linhasAfetadas > 0) {
            console.log(`Sucesso! ${linhasAfetadas} usuarios admin geral`);
        } else {
            console.log("Nenhum usuário encontrado com os e-mails informados. Complete o perfil deles.");
        }

    } catch (error) {
        console.error("Erro ao atualizar usuários:", error);
    } finally {
        db.destroy();
    }
}

definirAdmins();