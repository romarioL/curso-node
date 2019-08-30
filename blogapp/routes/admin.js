const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
 require('../models/categoria')
const Categoria = mongoose.model("categorias")
const flash = require('connect-flash')
require("../models/postagem")
const Postagem = mongoose.model("postagens")
const { eAdmin } = require("../helpers/eAdmin")

router.get('/', eAdmin, function(req, res){
	res.render('admin/index')
})

router.get('/posts', function(req, res){
	res.send("Página posts")
})

router.get('/categorias', function(req,res){
	Categoria.find().sort({date: 'desc'})
	    .then(function(categorias) {
	    	res.render('admin/categorias', {categorias: categorias})
	    })
	    .catch(function(err){
	    	req.flash("error_msg", "Houve um erro ao listas as categorias")
	    	res.redirect("/admin")
	    })

})

router.get('/categorias/add', function(req,res){
	res.render('admin/addCategoria')
})

router.post('/categorias/nova', function(req, res){

	var erros = []

	if(!req.body.nome ||  typeof req.body.nome == undefined  ||  req.body.nome == null ) {
                  erros.push({ texto: "Nome inválido"})
	}

	if(!req.body.slug ||  typeof req.body.slug == undefined || req.body.slug == null) {

		        erros.push({texto: "Slug inválido"})
	}

	if(req.body.nome.length < 2) {
            erros.push({texto: "Nome muito pequeno"})
	}

	if(erros.length > 0){
		res.render('admin/addCategoria', {
			erros: erros
		})

	}else {

      const novaCategoria = {
		nome: req.body.nome,
		slug: req.body.slug
	}

	new Categoria(novaCategoria)
	        .save()
	        .then(function(){
	        	req.flash("success_msg", "Categoria criada com sucesso")
	        	res.redirect("/admin/categorias")
	        })
	        .catch(function(err){
	        	req.flash("error_msg", "Falha ao criar categoria")
	        	res.redirect("/admin")
	        	
	        })

	    }


	        })

router.get("/categorias/edit/:id", function(req,res) {
	Categoria.findOne({_id: req.params.id})
	   .then(function(categoria) {
	   	   res.render("admin/editCategoria", {
	   	   	  categoria: categoria
	   	   })
	   })
	   .catch(function(err){
	   	    req.flash("error_msg", "Falha  ao encontrar categoria")
	   	    res.redirect("/admin/categorias")
	   })
	
})

router.post("/categorias/edit", function(req, res) {
	Categoria.findOne({_id: req.body.id})
	   .then(function(categoria) {
          categoria.nome = req.body.nome
          categoria.slug = req.body.slug
          categoria.save()
              .then(function(categoria){
              	req.flash("success_msg" , "Categoria editada com sucesso")
              	res.redirect("/admin/categorias")
              })
              .catch(function(err){
              	 req.flash("error_msg", "Falha ao editar categoria")
              	 res.redirect("/admin/categoria")
              })
	   })
	   .catch(function(err){
	   	 req.flash("error_msg", "Falha ao encontrar categoria")
	   	 res.redirect("/admin/categorias")
	   })
})


router.post("/categorias/deletar", function(req, res){
	Categoria.remove({_id: req.body.id})
	    .then(function(){
	    	req.flash("success_msg", "Categoria deletada com sucesso")
	    	res.redirect("/admin/categorias")
	    })
	    .catch(function(err){
            req.flash("error_msg", "Erro ao deletar categoria")
            res.redirect("/admin/categorias")
	    })
})


router.get("/postagens", function(req, res){
	Postagem.find().populate("categoria").sort({data: "desc"})
	    .then(function(postagens){
	    	res.render("admin/postagens", {postagens: postagens})
	    })
	    .catch(function(err){
	    	req.flash("error_msg", "Não  foi possível encontrar postagens")
	    	res.redirect("/admin")
	    })

	
})

router.get("/postagens/add", function(req, res){
	Categoria.find()
	  .then(function(categorias) {
	  	  res.render("admin/addPostagem", {
	  	  	categorias: categorias
	  	  })
	  })
	  .catch(function(error) {
	  	req.flash("error_msg", "Erro ao carregar o formulário")
	  	res.redirect("/admin")
	  })
	
})

router.post("/postagens/nova", function(req, res){
	var erros = []
	if(req.body.categoria == "0") {
         erros.push({texto: "Categoria  inválida, registre uma categoria"})
	}

	if(erros.length > 0) {
		res.render("admin/addCategoria", {erros: erros})
	}else {
		const novaPostagem = {
			titulo: req.body.titulo,
			descricao: req.body.descricao,
			conteudo: req.body.conteudo,
			categoria: req.body.categoria,
			slug: req.body.slug
		}

		new Postagem(novaPostagem)
		    .save()
		    .then(function(){
		    	req.flash("success_msg", "Postagem  publicada com sucesso")
		    	res.redirect("/admin/postagens")
		    })
		    .catch(function(err) {
		    	req.flash("error_msg", "Não foi possível  publicar sua postagem")
		    	res.redirect("/admin/postagens")
		    })
	}
})


router.get("/postagens/edit/:id", function(req, res){
	Postagem.findOne({_id: req.params.id})
	   .then(function(postagem) {
            Categoria.find()
               .then(function(categorias) {
                   res.render("admin/editPostagens", {
                   	categorias: categorias,
                   	postagem: postagem
                   })   
               })
               .catch(function(err){
               	   req.flash("error_msg", "Não  foi possível encontrar categorias")
               	   res.redirect("/admin/postagens")
               })
	   })
	   .catch(function(err) {
	   	 req.flash("error_msg", "Não  foi possível encontrar o post")
	   	 res.redirect("/admin/postagens")
	   })
	
})


router.post("/postagens/edit", function(req, res) {
       Postagem.findOne({_id: req.body.id})
          .then(function(postagem){
               postagem.titulo = req.body.titulo
               postagem.slug = req.body.slug
               postagem.descricao = req.body.descricao
               postagem.conteudo = req.body.conteudo
               postagem.categoria = req.body.categoria
               postagem.save()
                  .then(function(){
                  	  req.flash("success_msg", "Postagem  editada com sucesso")
                  	  res.redirect("/admin/postagens")
                  })
                  .catch(function(err) {
                  	 req.flash("error_msg", "Erro  ao editar mensagem")
                  	 res.redirect("/admin/postagens")
                  })

          })
          .catch(function(err){
          	req.flash("error_msg", "Erro ao salvar a edição")
          	res.redirect("/admin/postagens")
          })
})


router.get("/postagens/deletar/:id", function(req,res){
     Postagem.remove({_id: req.params.id})
        .then(function(){
        	req.flash("success_msg", " Postagem deletada com sucesso")
        	res.redirect("/admin/postagens")
        })
        .catch(function(err){
        	req.flash("error_msg", "Erro ao deletar postagem")
        	res.redirect("/admin/postagens")
        })
})



            
 





	





module.exports = router