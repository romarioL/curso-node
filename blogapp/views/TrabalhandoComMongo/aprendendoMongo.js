const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/aprendendo")
    .then(function(){
    	console.log("Conectado com sucesso")
    })
    .catch(function(erro){

    	console.log(erro)

    })


 const usuariosSchema = mongoose.Schema({
 	nome: {
 		type: String,
 		require: true 
 	},
 	sobrenome: {
 		type: String,
 		require: true
 	},
 	email: {
 		type: String,
 		require: true
 	},
 	idade: {
 		type: Number,
 		require: true
 	},
 	pais: {
 		type: String

 	}
 })

 mongoose.model('usuarios', usuariosSchema)


 const novoUsuario = mongoose.model('usuarios')

 new novoUsuario({
 	nome: "Victor",
 	sobrenome: "Lima",
 	email: "blablabla@gmail.com",
 	idade: 25,
 	pais: "Brasil"
 }).save()
   .then(function(){
       console.log("Salvo  com sucesso")
   })
   .catch(function(erro){
       console.log(erro)
   })