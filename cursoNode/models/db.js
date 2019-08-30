const Sequelize = require('sequelize')
const sequelize = new Sequelize('postagens', 'root', '', {
	host: "localhost",
	dialect: "mysql"
})


module.exports = {
	Sequelize: Sequelize,
	sequelize: sequelize 
}