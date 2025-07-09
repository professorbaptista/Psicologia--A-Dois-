
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Comentario = sequelize.define('Comentario', {
    
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    fotoUrl: {
        type: DataTypes.STRING,
    },

    depoimentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {timestamps: true });

module.exports = Comentario;
