

// Importações do express, rotas e path.
const express = require('express');
const genaralRoutes = require('./src/routes/routes');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');


// Importação do sequelize.
const sequelize = require('./src/config/database');

// Instânciando o express.
const app = express();
const Port = 3000; 

// Middlewares
app.use(express.json())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'))


// SESSÔES dos usuarios
app.use(session({
    secret: 'nzinga-nzonene2212',
    resave: false,
    saveUninitialized: false
}));

// Middlewares parser e public.
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Usuario logado visivel no site.
app.use((req, res , next) => {

    res.locals.usuario = req.session.usuario || null;
    next();
});

// Middleware de flash message.
app.use(flash());

app.use((req,res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

// Instanciando as rotas.
app.use('/', genaralRoutes)

// criando a tabela de depoimentos
sequelize.sync({ force: true });
// sequelize.sync();  

app.listen(Port, () => {
    console.log(`Site do projecto Psicologico rodando na porta ${Port}.`)
}) 