
const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },


    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },

    fotoPerfil: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'comum'
    },

}, { timestamps: true});

module.exports = Usuario;

