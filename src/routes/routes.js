

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

    res.render('services', { titulo: 'Página Services'})
});

router.get('/blogue', async (req, res) => {

    res.render('blogue', {titulo: 'Recomeçar com Propósito'})
});

router.get('/depoi', (req, res) => {
    

    res.render('depoi', {titulo: 'Depoimentos dos clientes satisfeitos e felizes', name: 'Jose', depoimentos: 'Muito satisfeito com o atendimento do Doutor. Ele salvou o meu casamento que estava a beira do colapso. Recomento...' })
})
router.get('/contacto', (req, res) => {

    res.render('contactos', {titulo: 'Entre em Contacto Agora'})
});

router.get('/agendar', async (req, res) => {

    res.render('agendarConversa', {titulo: 'Agende uma Conversa'})
})

module.exports = router;