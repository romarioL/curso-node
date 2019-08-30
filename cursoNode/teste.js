const Sequelize = require('sequelize')
const sequelize = new Sequelize('teste', 'root', '', {
	host: "localhost",
	dialect: "mysql"
})

const postagem = sequelize.define('postagens', {
	titulo:{
		type: Sequelize.STRING
	},
	conteudo: {
		type: Sequelize.TEXT
	}
})




const usuario = sequelize.define('usuarios', {
	nome: {
		type: Sequelize.STRING
	},
	sobrenome: {
		type: Sequelize.STRING
	},
	idade: {
		type: Sequelize.INTEGER
	},
	email: {
		type: Sequelize.STRING
	}
})

usuario.create({
	nome: "Victor",
	sobrenome: "Lima",
	idade: 20,
	email: "blablabla@gmail.com"
})

