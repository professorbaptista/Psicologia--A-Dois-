
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
}, { timestamps: true});

module.exports = Usuario;

