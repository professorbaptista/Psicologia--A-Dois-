

const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {

    const user = { name: 'Jose', profissao: 'Psicologo',interesses: 'Programação'}

    res.render('homePage', {user, titulo: 'Página Home'})
})

router.get('/about', async (req, res) => {

    res.render('about', {titulo: 'Página Sobre'})
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
})

module.exports = router;