

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {

    const user = { name: 'Jose', profissao: 'Psicólogo',interesses: 'Programação'}

    res.render('homePage', {user, titulo: '"Ajudando pessoas a constituirem e manterem relacionamentos saudáveis, conscientes e duradouros"'})
})

router.get('/about', async (req, res) => {

    res.render('about', {titulo: 'José Baptista | Psicólogo'})
});

router.get('/services', async (req, res) => {

    res.render('services', { titulo: 'Página Services'})
});

router.get('/blogue', async (req, res) => {

    res.render('blogue', {titulo: 'Página do Blogue'})
});

router.get('/depoi', (req, res) => {

    res.render('depoi', {titulo: 'Pagina de Depoimentos'})
})
router.get('/contacto', (req, res) => {

    res.render('contactos', {titulo: 'Pagina de contactos'})
});

router.get('/agendar', async (req, res) => {

    res.render('agendarConversa', {titulo: 'Agende uma Conversa'})
})

module.exports = router;