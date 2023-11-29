const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('./User')
const Tought = require('./Tought')

const ToughtLike = db.define('ToughtLike', {
    number: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})

ToughtLike.belongsTo(User)
User.hasMany(ToughtLike)

ToughtLike.belongsTo(Tought)
Tought.hasMany(ToughtLike)

module.exports = ToughtLike