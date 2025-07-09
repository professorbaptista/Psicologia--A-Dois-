
const sequelize = require('../config/database');

const Agendamento = require('../models/agendamento');

(async() => {
    try {
        
        await sequelize.sync({ force: true});

        await Agendamento.bulkCreate([
            {
                name: 'Jose Baptista',
                tata: '2025-11-7',
                hora: '10:00',
                servico: 'casal',
                message: 'Gostaria de iniciar minha terapia.'
            },
            {
                name: 'Jose Baptista',
                tata: '2025-11-7',
                hora: '10:00',
                servico: 'casal',
                message: 'Gostaria de iniciar minha terapia.'
            },
        ])

        console.log('Banco reacriado e dados inseridos com sucesso.');
        process.exit();

    } catch (error) {
        
        console.log('Erro ao popukar o banco.', error);
        process.exit(1)

    }
})();


