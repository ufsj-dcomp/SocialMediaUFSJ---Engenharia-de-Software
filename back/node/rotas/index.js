const usuariosRotas = require("./usuariosRotas");
const cursosRotas = require("./cursosRotas");
const adminCursoRelacaoRotas = require("./administradorCursoRelacaoRota");

module.exports = (app) => {
    app.use(usuariosRotas);
    app.use(cursosRotas);
    app.use(adminCursoRelacaoRotas);
}