const express = require("express");
const app = express();
const port = process.env.PORT;
const router = require("./rotas/index");
const conexao =  require("./infraestrutura/conexao")

router(app);

app.listen(port, (error) => {
    if(error){
        console.log("Erro");
        return;
    }

    console.log("executando...")
})