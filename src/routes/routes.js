

const express = require('express');

const moment = require('moment');

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
router.get('/deixarDepoimento', (req, res) => {

    res.render('deixarDepoimento', {titulo: 'Deixe o seu depoimento'})
});

let depoimentos = [];
let comments = [];

router.get('/depoi', async (req, res) => {
    const id = req.params.id
    
    res.render('depoi', { depoimentos, comments, titulo: 'Depoimentos dos Clientes Satisfeitos e Felizes', id });
});


router.post('/adicionar', async (req, res) => {

    const { name, message } = req.body;

    if(name && message){
        depoimentos.push({ name, message })
    }

    console.log(req.body)
    res.redirect('/depoi')
})

let contactos = [];
router.get('/contacto', (req, res) => {

    res.render('contactos', {titulo: 'Entre em Contacto Agora mesmo, não adie mais o seu problema!'})
});

router.post('/contactos', async (req, res) => {
    try {

        const { name, email, message } = req.body;
        contactos.push({ name, email, message})
        console.log('contactos:', contactos)
        res.redirect('/agendamento')
    } catch (error) {
        res.render('contactos', {error: 'Erro ao enviar os contactos'})
    }

    
})



router.get('/agendar', async (req, res) => {

    res.render('agendarConversa', {titulo: 'Agende um serviço'})
});

let agendamentos = [];

router.get('/agendamento', async (req, res) => {

    res.render('agendamento', { agendamentos, contactos, message: 'Agendamento efectuado com sucesso!', titulo: 'Agendamentos', contato: 'Contactos', comments }) 
});

 
router.post('/agendarConsulta', async (req, res) => {

  try {
    
    const { name, data, hora, tipo_servicos, message } = req.body;
    agendamentos.push({ name, data, tipo_servicos, hora, message})
    res.redirect('/agendamento');

  } catch (error) {
    res.render('agendar', { error: 'Erro ao agendar consulta...'})
  }
});

router.post('/comentarios/:id', async (req, res) => {
    
    try {
        
        const { name, comment } = req.body;
       
        const id = req.params.id;
        console.log('Id: ', id)

        const depoimento = depoimentos.find(d => d.id === id);
         
        console.log('Depoimento: ', depoimento)
        if (depoimento && name && comment) {
            depoimentos.push({depoimento, name, comment});

            const data = moment().format('DD/MM/YYYY HH:MM');

            const novoComentario = {
                name,
                comment,
                data, 
                foto: '/users/usuario.png'
            }

            comments.push(novoComentario);
            console.log(novoComentario)
            res.redirect('/depoi')
        }
    } catch (error) {
        res.render('erro', {error: 'Erro ao enviar o comentário!'}) 
        
    }
})

module.exports = router;