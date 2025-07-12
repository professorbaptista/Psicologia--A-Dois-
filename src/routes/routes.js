

const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');



// Importação de models.
const Depoimento = require('../models/Depoimento');
const Agendamento = require('../models/agendamento');
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuarios');

const starage = multer.diskStorage({ destination: (req, file, cb) =>{
    cb(null, '/public/uploads');
},

filename: (req, file, cb) => {
    const ext = path.extname(file.orginalname);
    const nameArquivo = `foto_${Date.now()}${ext}`;
    cb(null, nameArquivo)
}
});

const upload = multer({ starage });


const router = express.Router();

// Memorias de armazenamento
let depoimentos = [];
let comments = [];
let agendamentos = [];
let contactos = [];

// Function meadleware.
function isAuthenticated( req, res, next ){
    if (req.session.usuario) {
        return next();
    } else {
        res.redirect('/login')
    }
}

// Middleware de administrador.
function isAdmin (req, res, next){
    if (req.session.usuario && req.session === 'admin') {
        return next();
    }

    req.flash('error_msg', 'Acesso permitido apenas para administradores.')

    res.redirect('/login')
}

// Rota do foto de Perfil.

// Rota do adminstrador
router.get('/admin',  async (req, res ) => {

    // Contagem de total de usuarios, agendamentos, depoimentos e comentarios.
    const totalUsuarios = await Usuario.count();
    const totalAgendamentos = await Agendamento.count();
    const totalDepoimentos = await Depoimento.count();
    const totalComentarios = await Comentario.count();

    // Contando os últimos depoimentos e comentarios.
    const ultimosDepoimentos = await Depoimento.findAll({
        limit: 5,
        order: [[ 'createdAt', 'DESC']]
    });

    const ultimosAgendamentos = await Agendamento.findAll({
        limit: 5,
        order: [[ 'createdAt', 'DESC']]
    })

    res.render('admin', { 
        usuario: req.session.usuario, 
        totalUsuarios,
        totalAgendamentos,
        totalDepoimentos,
        totalComentarios,
        ultimosAgendamentos,
        ultimosDepoimentos,
        titulo: 'Painel de Administração' 

    })
}) 

// Rota GET da foto de perfil do usuario
router.get('/perfilUsuario', (req, res) => {

    res.render('perfilUsuario', { titulo: 'Painel do usuário'})
})
// Rota post de foto de perfil.
router.post('/upload-foto', upload.single('foto'), async (req, res) => {
    const usuarioId = req.session.usuario?.id; 

    if (!usuarioId) {
        req.flash('error_msg', 'Sessão expirada ou usuário não autenticado.');
        return res.redirect('/perfilUsuario');
    }

    const usuario = await Usuario.findByPk(usuarioId);
    if (!usuario) {
        req.flash('error_msg', 'Usuário não encontrado.');
        return res.redirect('/perfilUsuario');
    }

    if (!req.file) {
        req.flash('error_msg', 'Nenhuma foto enviada.');
        return res.redirect('/perfilUsuario');
    }

    usuario.fotoPerfil = `/uploads/${req.file.filename}`;
    await usuario.save();

    // Atualize a sessão (confirme se é mesmo 'usuario' e não 'usua')
    req.session.usuario.fotoPerfil = usuario.fotoPerfil;

    req.flash('success_msg', 'Foto atualizada com sucesso!');
    res.redirect('/perfilUsuario');
});


// Rota de registrar usuario
router.get('/cadastrar', async (req, res) => {

   const id = req.params.id;
    const usuarios = Usuario.findByPk(id)

    res.render('cadastrar', { usuarios, titulo: 'Cadastre-se'})
});

// Rota de usuarios cadstrados
router.get('/usuarios',  async ( req, res ) => {

    const usuarios = await Usuario.findAll();

    res.render('usuarios', { usuarios, titulo: 'Usuários cadastrados'})
}) 

// Rota post para cadastrar usuario.
router.post('/cadastrarUsuario', async ( req, res ) => {
    
    const { name, email, password } = req.body;
    const isAdmin = req.query;
    const hash = await bcrypt.hash(password, 10); // criptografa a senha.

    await Usuario.create({ name, email, password: hash, isAdmin });

   
    // Apos o cadastro e login 
    if (Usuario.tipo === 'admin') { 
        res.redirect('/admin')
    } else {
        res.redirect('/perfilUsuario')
    }
    // res.redirect('/login')
});

router.get('/editarUsuario/:id', isAuthenticated, async (req, res ) => {

    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id)

    res.render('editarUsuario', { usuario, titulo: 'Editar Usuário'})
});

router.post('/editar/:id', isAuthenticated, async (req, res ) => {
    const id = parseInt(req.params.id);
    console.log('ID Editar: ', id)
    const { name, email } = req.body;
   
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
        usuario.name = name;
        usuario.email = email;
        await usuario.save();
    }

    res.redirect('/usuarios')
}); 

router.post('/deletar/:id', isAuthenticated, async (req, res ) => {

    const id = parseInt(req.params.id);
    await Usuario.destroy({ where: {id}})

    res.redirect('/usuarios')
})

// Rota de login.
router.get('/login', async (req, res) => {

    res.render('login', { titulo: 'Faça o login para continuar'})
});

// Rota post de login.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email }});
    console.log('Email recebido: ', email);

    if (!usuario) {
      req.flash('error_msg', 'Usuário não encontrado...');
      return res.redirect('/login'); // <-- importante
    }

    const senhaValida = await bcrypt.compare(password, usuario.password);
    console.log('Senha válida: ', senhaValida);

    if (!senhaValida) {
      req.flash('error_msg', 'Senha inválida...');
      return res.redirect('/login'); // <-- importante
    }

    // Usuário autenticado com sucesso
    req.session.usuario = {
      id: usuario.id,
      name: usuario.name,
      isAdmin: usuario.isAdmin 
    };

    req.flash('success_msg', 'Login realizado com sucesso!');
    return res.redirect('/admin');
    
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    req.flash('error_msg', 'Erro interno no servidor');
    return res.redirect('/login');
  }
});

// Logout de sessão
router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/login')
});



// Rota de Home.
router.get('/', async (req, res) => {

    res.render('homePage', { titulo: '"Ajudando pessoas a constituírem e manterem relacionamentos saudáveis, conscientes e duradouros"'})
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

router.get('/editarDepoimento/:id', isAuthenticated, async (req, res) => {

    const depoimento = await Depoimento.findByPk(req.params.id);

    res.render('editarDepoimento', { depoimento })
});

router.post('/editarDepoimento/:id', isAuthenticated, async (req, res) => {


    const id = parseInt(req.params.id);
    const { name , message } = req.body;
   
    const depoimento = await Depoimento.findByPk(id);

    if (!depoimento) {
        req.flash('error_msg', 'Erro ao editar depoimento')
    }
    if (depoimento) {
        await depoimento.update({ name, message }
);
    }
    
    req.flash('success_msg', 'Depoimento actualizado com sucesso!')
    res.redirect('/depoi')
});

router.post('/deletar/:id',  async (req, res) => {

    const depoimento = await Depoimento.findByPk(req.params.id);

    if (!depoimento) {
        req.flash('error_msg', 'Não foi possivel deletar o depoimento')
    }
    if (depoimento) {
        await depoimento.destroy();
    }

    req.flash('success_msg', 'Depoimento apagado com sucess!')
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
router.get('/agendar',  async (req, res) => {

     const agendamentos = await Agendamento.findAll({ order: [['createdAt', 'DESC']] });
  
    console.log('Agendados: ', agendamentos) 
    

    res.render('agendarConversa', { agendamentos, titulo: 'Agende um serviço'}) // Formulario de agendamento
});

// Agendamento da consulta preencher e enviar o formulario
router.post('/agendarConsulta', async (req, res) => {

      //console.log('BODY:', req.body); 
  try {

    const { name, data, hora, tipo_servicos, message } = req.body;

    await Agendamento.create({ name, data, hora, tipo_servicos, message });
   
    req.flash('success_msg', 'Serviço agendado com sucesso!')
    res.redirect('/agendamento');

  } catch (error) {
       console.error('Erro ao salvar agendamento:', error);
       res.status(500).send('Erro ao salvar agendamento.');
  }
});

// Rota agendamento Exibe a lista das agendas
router.get('/agendamento', isAuthenticated, async (req, res) => {

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

router.post('/editar/:id', isAuthenticated, async (req, res) => {

    const { name, data, hora, tipo_servicos, message } = req.body;

    const agendamento = await Agendamento.findByPk(req.params.id);
    if (!agendamento) {
        req.flash('error_msg', 'Não foi possível concretizar o agendamento!')
    }
    
    if (agendamento) {
        await agendamento.update ({  
        name,
        data,
        hora,
        tipo_servicos,
        message,
    })
       
    }
   
    req.flash('success_msg', 'Agendamento efectuado com sucesso!')
    res.redirect('/agendamento');
     
});

router.get('/deletarAgendamento/:id', isAuthenticated, async (req, res) => {

    const agendamento = await Agendamento.findByPk(req.params.id);

    if (agendamento) {
        await agendamento.destroy();
    }

    req.flas('success_msg', 'Agendamento apagado com sucesso!')
    res.redirect('/agendamento')
  
});

module.exports = router;