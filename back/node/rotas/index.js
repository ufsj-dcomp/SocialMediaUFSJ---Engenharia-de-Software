const usuariosRotas = require("./usuariosRotas");
const cursosRotas = require("./cursosRotas");

module.exports = (app) => {
    app.use(usuariosRotas);
    app.use(cursosRotas);
}