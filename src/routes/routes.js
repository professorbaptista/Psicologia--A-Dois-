

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {

    const user = { name: 'Jose', profissao: 'Psicólogo',interesses: 'Programação'}

    res.render('homePage', {user, titulo: '"Ajudando pessoas a constituírem e manterem relacionamentos saudáveis, conscientes e duradouros"'})
})

router.get('/about', async (req, res) => {

    res.render('about', {titulo: 'José Baptista | Psicólogo'})
});

router.get('/services', async (req, res) => {

    res.render('services', { titulo: 'Meus Serviços', services: 'José Baptista | Psicólogo'}) 
});

router.get('/blogue', async (req, res) => {

    res.render('blogue', {titulo: 'Recomeçar com Propósito'})
});

// Rota depoimentos
let depoimentos = [
    {name: 'Ana A.', message: 'A terapia com Dr. Baptista transformou minha vida. Bem haja, o Dr. Baptista!', image: 'img'},
    {name: 'Carlos M.', message: 'Aprendi a me comunicar melhor com a minha parceira! Obrigado Dr. Baptista', image: 'img'}
];

router.get('/depoi', async (req, res) => {
    
    res.render('depoi', { depoimentos, titulo: 'Depoimentos dos Clientes Satisfeitos e Felizes' });
});

router.post('/adicionar', async (req, res) => {

    const { name, message } = req.body;

    if(name && message){
        depoimentos.push({ name, message })
    }

    console.log(req.body)
    res.redirect('/depoi')
})


router.get('/contacto', (req, res) => {

    res.render('contactos', {titulo: 'Entre em Contacto Agora mesmo, não adie mais o seu problema!'})
});

router.get('/agendar', async (req, res) => {

    res.render('agendarConversa', {titulo: 'Agende uma Conversa'})
});

router.post('/agendarConsulta', async (req, res) => {

    res.redirect('/agendar')
})

module.exports = router;