const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const router = require("./rotas/index");

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
router(app);

app.listen(port, (error) => {
    if(error){
        console.log("Erro ao iniciar o servidor:", error);
        return;
    }
    console.log(`Executando na porta ${port}...`);   
})