
const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

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

module.exports = Depoimento;