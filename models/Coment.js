const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('./User')
const Tought = require('./Tought')

const Coment = db.define('Coment', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    }
})

Coment.belongsTo(User)
User.hasMany(Coment)

Coment.belongsTo(Tought)
Tought.hasMany(Coment)

module.exports = Coment