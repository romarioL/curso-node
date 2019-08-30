const express = require("express")
const router = express.Router()
const mongoose =require("mongoose")
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/registro", function(req, res){
       res.render("usuarios/registrar")
})


router.post("/registro", function(req, res){
	var erros = []
	if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
		erros.push({texto: "Nome inválido"})
	}

	if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
		erros.push({texto: "Email inválido"})
	}

	if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
		erros.push({texto: "Senha inválida"})
	}

	if(req.body.senha.length < 4) {
		erros.push({texto: "Senha curta"})
	}

	if(req.body.senha != req.body.senha2) {
		erros.push({texto: "Senhas diferentes  tente novamente"})
	}

	if(erros.length > 0) {
         res.render("usuarios/registrar",{erros: erros})
	}else {

		Usuario.findOne({email: req.body.email})
		    .then(function(usuario){
		    	if(usuario){
                    req.flash("error_msg", "Já existe uma conta com esse email")
                    res.redirect("/usuarios/registro")
		    	}else{

		    		const novoUsuario = new Usuario({
		    			nome: req.body.nome,
		    			email: req.body.email,
		    			senha: req.body.senha

		    		})

		    		

		    		bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        	if(erro){
                        		req.flash("error_msg", " Houve um erro durante o salvamento do usuário")
                        	}

                        	novoUsuario.senha = hash

                        	novoUsuario.save()
                        	   .then(function(){
                                    req.flash("success_msg", "Usuário cadastrado com sucesso")
                                    res.redirect("/")
                        	   })
                        	   .catch(function(err){

                        	  

                        	   	    req.flash("error_msg", "Não foi possível cadastrar o usuário")
                        	   	    res.redirect("/")

                        	   })
                        })
		    		})

		    	}
		    })
		    .catch(function(err){
		    	req.flash("error_msg", "não foi possível encontrar o usuário")
		    	res.redirect("/usuarios/registro")
		    })

	}
})


router.get("/login", function(req, res){
	res.render("usuarios/login")
})

router.post("/login", function(req, res, next){

	 passport.authenticate("local", {
	 	successRedirect: "/",
	 	failureRedirect: "/usuarios/login",
	 	failureFlash: true
	 })(req, res, next)

})


router.get("/logout", function(req, res) {
	req.logout()
	req.flash("success_msg", "Deslogado com sucesso")
	res.redirect("/")
})



module.exports = router