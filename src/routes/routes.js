

const express = require('express');

// Importação de models.
const Depoimento = require('../models/Depoimento');
const Agendamento = require('../models/agendamento');
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuarios');

const router = express.Router();

// Memorias de armazenamento
let depoimentos = [];
let comments = [];
let agendamentos = [];
let contactos = [];


function loginRequired( req, res, next ){


}
loginRequired();

// Rota de registrar usuario
router.get('/cadastrar', async (req, res) => {

    res.render('cadastrar', { titulo: 'Cadastre-se'})
});

// Rota de login.
router.get('/login', async (req, res) => {

    res.render('login', { titulo: 'Faça o login'})
});

router.get('/', async (req, res) => {

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

    const depoimentos = await Depoimento.findAll({ include: Comentario, order: [[ 'createdAt', 'DESC']]});
    
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

// Comentarios dos depoimentos.
router.post('/comentarios/:depoimentoId', async (req, res) => {

        const { name, comment, fotoUrl } = req.body;
       
        const { depoimentoId } = req.params;

        await Comentario.create({
            name, 
            comment,
            fotoUrl,
            depoimentoId,
        });

        console.log('Comentario: ', req.body)

        res.redirect('/depoi')
})

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

    // Aplicando filtro de agendamentos.
    const { name, tipo_servicos } = req.query;
    const where = {};
    if(name) where.name = name;
    if(name) where.tipo_servicos = tipo_servicos;
    console.log('Where: ', where)

    // Listando todos os agendamentos.
      const agendamentos = await Agendamento.findAll({ where, order: [['createdAt', 'DESC']] });
 
    res.render('agendamento', { agendamentos, agendamentos, contactos, message: 'Agendamento efectuado com sucesso!', titulo: 'Lista de agendamentos', contato: 'Contactos', comments }) 
});


router.get('/editar/:id', async (req, res) => {  

    const id = parseInt(req.params.id);
    console.log('ID Editar: ', id)

    const agendamento = await Agendamento.findByPk(id);
    console.log('Agendamento a edutar: ', agendamento)
    res.render('editar', { agendamento, titulo: 'Edite o seu agendamento',  });
});

router.post('/editar/:id', async (req, res) => {

    const { name, data, hora, tipo_servicos, message } = req.body;

    const agendamento = await Agendamento.findByPk(req.params.id);
    
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
  
});

module.exports = router;