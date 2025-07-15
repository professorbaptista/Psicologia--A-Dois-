
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');

const Agendamento = sequelize.define('Agendamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
    }
  },
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^([01]\d|2[0-3]):?([0-5]\d)$/,
    }
  },
  tipo_servicos: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'agendamento'
});

Usuario.hasMany(Agendamento, { foreignKey: 'usuarioId'});
Agendamento.belongsTo(Usuario, { foreignKey: 'usuarioId'});

module.exports = Agendamento;
