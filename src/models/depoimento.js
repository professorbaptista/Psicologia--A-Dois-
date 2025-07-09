
const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Comentario = require('./comentario');

const Depoimento = sequelize.define('Depoimento', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

}, { timestamps: true });

Depoimento.hasMany(Comentario, { foreignKey: 'depoimentoId' });

Comentario.belongsTo(Depoimento, { foreignKey: 'depoimentoId' });

module.exports = Depoimento;