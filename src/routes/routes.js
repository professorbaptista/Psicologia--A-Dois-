

const express = require('express');

const moment = require('moment');

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

    const id = parseInt(req.params.id);
    const depoimento = depoimentos.find(d => d.id === id);
    
    res.render('depoi', { depoimento, depoimentos, comments, titulo: 'Depoimentos dos Clientes Satisfeitos e Felizes', id });
});


router.post('/adicionar', async (req, res) => {

    const { name, message } = req.body;

    const novoDepoimento = {
        id: Date.now(),
        name, 
        message
    }
    console.log('Novo depo: ', novoDepoimento)
    depoimentos.push(novoDepoimento)

    // if(name && message){
    //     depoimentos.push({ name, message })
    // }

    // console.log(req.body)
    res.redirect('/depoi')
});

// Editar depoimentos

router.get('/editarDepoimento/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    console.log('Edite ID: ', id)
    console.log('Lista atual de depoimento: ', depoimentos)

    const depoimento = depoimentos.find(d => d.id === id);
    console.log('Depoimento encontrado: ', depoimento)

    if (!depoimento) return res.send('Depoimento nao encontrado.')

    res.render('editarDepoimento', { depoimento })
});

router.post('/editarDepoimento/:id', (req, res) => {

    const id = parseInt(req.params.id);
    console.log('ID DO EDITAR DEPOI: ', id)

    const { name, message } = req.body;
     console.log('DADOS DO EDITAR DEPOI: ', req.body)
    
    const depoimento = depoimentos.find(d => d.id === id);
    
    if (depoimento) {
        depoimento.name = name;
        depoimento.message = message;
    }

     console.log(' DEPOI: ', depoimento)

    res.redirect('/depoi')
});

router.post('/deletar/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const depoimentos = depoimentos.filter(d => d.id !== id);

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

router.get('/agendar', async (req, res) => {

    // const agendamento = agendamentos.find(a => a.id === id);

    res.render('agendarConversa', { titulo: 'Agende um serviço'})
});

router.post('/agendarConsulta', async (req, res) => {

  try {
    
    const { name, data, hora, tipo_servicos, message } = req.body;

    agendamentos.push({ id: Date.now(), name, data, hora, tipo_servicos, message });
    console.log('Age: '. agendamentos)

    res.redirect('/agendamento');

  } catch (error) {
    res.render('agendar', { agendamentos, error: 'Erro ao agendar consulta...'})
  }
});

router.get('/agendamento', async (req, res) => {

     const id = req.params.id;  

    const agendamento = agendamentos.find(a => a.id === id);

    res.render('agendamento', { agendamento, agendamentos, contactos, message: 'Agendamento efectuado com sucesso!', titulo: 'Agendamentos', contato: 'Contactos', comments }) 
});


router.get('/editar/:id', (req, res) => {

    const id = parseInt(req.params.id);
    console.log('ID: ', id)

    const agendamento = agendamentos.find(a => a.id === id);

    console.log('Agendado: ', agendamento)
    res.render('editar', { agendamento, titulo: 'Edite o seu agendamento',  });
});

router.post('/editar/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const { name, data, hora, tipo_servicos, message } = req.body;

    console.log('corpo: ', req.body)

    const agendamento = agendamentos.find(a => a.id === id);

    console.log('Editado: ', agendamento)
    if (agendamento) {
        agendamento.name = name;
        agendamento.data = data;
        agendamento.hora = hora;
        agendamento.tipo_servicos = tipo_servicos;
        agendamento.message = message;
    }
   
    res.redirect('/agendamento');

    res.render('agendamento', { error: 'Erro ao editar dados...'})
    
});

router.get('/deletar/:id', async (req, res) => {

    const id = parseInt(req.params.id);
       console.log('Id: ', req.params.id)

    const agendamentos = agendamentos.filter(a => a.id !== id);

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