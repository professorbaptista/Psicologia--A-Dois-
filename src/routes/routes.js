

const express = require('express');

const moment = require('moment');

// Importação de models.
const Depoimento = require('../models/Depoimento');
const Agendamento = require('../models/agendamento');


const router = express.Router();



// Memorias de armazenamento
let depoimentos = [];
let comments = [];
let agendamentos = [];
let contactos = [];

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

    const id = parseInt(req.params.id);

    const depoimento = depoimentos.find(d => d.id === id);

    res.render('deixarDepoimento', { depoimento, titulo: 'Deixe o seu depoimento'})
});


router.get('/depoi', async (req, res) => {

    const depoimentos = await Depoimento.findAll();
    
    res.render('depoi', { depoimentos, depoimentos, comments, titulo: 'Depoimentos dos Clientes Satisfeitos e Felizes' });
});

// Rota post para adicionar depoimentos.
router.post('/adicionar', async (req, res) => {

    const { name, message } = req.body;

    await Depoimento.create({ name, message });

    res.redirect('/depoi') 
});

// Editar depoimentos

router.get('/editarDepoimento/:id', async (req, res) => {

    const depoimento = await Depoimento.findByPk(req.params.id);

    res.render('editarDepoimento', { depoimento })
});

router.post('/editarDepoimento/:id', async (req, res) => {


    const id = parseInt(req.params.id);
    const { name , message } = req.body;
   
    const depoimento = await Depoimento.findByPk(id);

    if (depoimento) {
        await depoimento.update({ name, message }
);
    }
    
    res.redirect('/depoi')
});

router.post('/deletar/:id', async (req, res) => {

    const depoimento = await Depoimento.findByPk(req.params.id);

    if (depoimento) {
        await depoimento.destroy();
    }

    res.redirect('/depoi')
});

router.get('/contacto', (req, res) => {

    res.render('contactos', {titulo: 'Entre em Contacto Agora mesmo, não adie mais o seu problema!'})
});

router.post('/contactos', async (req, res) => {
    try {

        const { name, email, message } = req.body;
        const contactos = contactos.push({ name, email, message})
        console.log('contactos:', contactos)
        res.redirect('/agendamento')
    } catch (error) {
        res.render('contactos', {contactos, error: 'Erro ao enviar os contactos'})
    }
    
});
// Rota para agendar consulta exibe o formulario.
router.get('/agendar', async (req, res) => {

     const agendamentos = await Agendamento.findAll({ order: [['createdAt', 'DESC']] });
  
    console.log('Agendados: ', agendamentos) 
    

    res.render('agendarConversa', { agendamentos, titulo: 'Agende um serviço'}) // Formulario de agendamento
});

// Agendamento da consulta preencher e enviar o formulario
router.post('/agendarConsulta', async (req, res) => {
      console.log('BODY:', req.body); 
  try {

    const { name, data, hora, tipo_servicos, message } = req.body;

    await Agendamento.create({ name, data, hora, tipo_servicos, message });

    res.redirect('/agendamento');

  } catch (error) {
       console.error('Erro ao salvar agendamento:', error);
       res.status(500).send('Erro ao salvar agendamento.');
  }
});

// Rota agendamento Exibe a lista das agendas
router.get('/agendamento', async (req, res) => {

      const agendamentos = await Agendamento.findAll({ order: [['createdAt', 'DESC']] });

    res.render('agendamento', { agendamentos, agendamentos, contactos, message: 'Agendamento efectuado com sucesso!', titulo: 'Lista de agendamentos', contato: 'Contactos', comments }) 
});


router.get('/editar/:id', (req, res) => { 

    const id = parseInt(req.params.id);
    console.log('ID: ', id)

    const agendamento = Agendamento.findByPk(id);
    console.log('Agendado: ', agendamento)
    res.render('editar', { agendamento, titulo: 'Edite o seu agendamento',  });
});

router.post('/editarAgendamento/:id', async (req, res) => {

    

    const { name, data, hora, tipo_servicos, message } = req.body;

    const agendamento = Agendamento.findByPk(req.params.id);

    
    if (agendamento) {
        await agendamento.update ({  
        name,
        data,
        hora,
        tipo_servicos,
        message,
    })
       
    }
   
    res.redirect('/agendamento');

    res.render('editar', { error: 'Erro ao editar dados...'})
    
});

router.get('/deletarAgendamento/:id', async (req, res) => {

    const agendamento = await Agendamento.findByPk(req.params.id);

    if (agendamento) {
        await agendamento.destroy();
    }

    res.redirect('/agendamento')

    // res.render('agendamento', { deletar, error: 'Erro ao deletar...'})
  
});


router.post('/comentarios', async (req, res) => {
    
    try {
        
        const { name, comment } = req.body;
       
        const id = parseInt(req.params.id);

        const depoimento = depoimentos.find(d => d.id === id);
         
        console.log('Depoimento: ', depoimento)
        if (depoimento && name && comment) {
            depoimentos.push({ id: Date.now(), depoimento, name, comment});

            const data = moment().format('DD/MM/YYYY HH:MM');

            const novoComentario = {

                id: Date.now(),
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