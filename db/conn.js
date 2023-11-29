const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', 'diego314', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectamos ao MySQL!')
} catch (err) {
    console.log(err)
}

module.exports = sequelize