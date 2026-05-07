const usuariosRotas = require("./usuariosRotas");
const cursosRotas = require("./cursosRotas");
const adminCursoRelacaoRotas = require("./administradorCursoRelacaoRota");
const materiasRotas = require("./materiasRotas");

module.exports = (app) => {
    app.use(usuariosRotas);
    app.use(cursosRotas);
    app.use(adminCursoRelacaoRotas);
    app.use("/api/materias", materiasRotas);
}