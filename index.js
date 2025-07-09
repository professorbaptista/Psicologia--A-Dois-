

// Importações do express, rotas e path.
const express = require('express');
const genaralRoutes = require('./src/routes/routes');
const path = require('path');

// Importação do sequelize.
const sequelize = require('./src/config/database');

// const Depoimento = require('./src/models/depoimento');
// const Agendamento = require('./src/models/agendamento');

// Instânciando o express.
const app = express();
const Port = 3000; 

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'))
app.use(express.static(path.join(__dirname, 'src', 'public')));


// Instanciando as rotas.
app.use('/', genaralRoutes)

// criando a tabela de depoimentos
sequelize.sync({ force: true });

app.listen(Port, () => {
    console.log(`Site do projecto Psicologico rodando na porta ${Port}.`)
}) 