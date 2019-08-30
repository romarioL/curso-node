const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/postagem")
const  Postagem = mongoose.model("postagens")
require("./models/categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)


app.use(session({
	secret: 'cursoDeNode',
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function(req, res, next){
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user  || null
  
	next()
})

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/blogapp')
    .then(function(){
    	console.log("Conectado ao mongodb")
    })
    .catch(function(err){
    	console.log("Falha ao conectar " + err)
    })



app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


app.use('/admin', admin)
app.use("/usuarios", usuarios)

app.get('/', function(req, res){
	Postagem.find().populate("categoria").sort({data: "desc"})
	    .then(function(postagens) {
             res.render("index", {postagens: postagens})
	    })
	    .catch(function(err){
	    	req.flash("error_msg", "Erro interno")
	    	res.redirect("/404")
	    })
	
})

app.get("/404", function(req, res){
	res.send("Erro 404")
})

app.get("/postagens/:slug", function(req, res){
        Postagem.findOne({slug: req.params.slug})
           .then(function(postagem){
           	 if(postagem) {
           	 	res.render("postagem/index", {postagem: postagem})
           	 }else {
           	 	req.flash("error_msg", " Postagem não encontrada")
           	 	res.redirect("/")
           	 }
           })
           .catch(function(err) {
           	   req.flash("error_msg", "  Não  foi possível encontrar a postagem")
           	 	res.redirect("/")
           })

})

app.get("/categorias", function(req, res) {
     Categoria.find()
        .then(function(categorias) {
              res.render("categorias/categorias", {categorias: categorias})
        })
        .catch(function(err) {
          req.flash("error_msg", "Não  foi possível encontrar as categorias")
          req.redirect("/")
        })
})

app.get("/categorias/:slug", function(req, res){
       Categoria.findOne({ slug: req.params.slug})
             .then(function(categoria) {
                  if(categoria) {
                    Postagem.find({categoria: categoria._id})
                       .then(function(postagens){
                            res.render("categorias/slug", {postagens: postagens, categoria: categoria})
                       })
                       .catch(function(err){
                           req.flash("error_msg", "Não existem postagens nessa categoria")
                           res.redirect("/categorias")
                       })
                  }else{
                    req.flash("error_msg", "Categoria não existe")
                    res.redirect("/categorias")
                  }
             })
             .catch(function(err){
                req.flash("error_msg", "Categoria não encontrada")
                res.redirect("/categorias")
             })
})


const PORT = 8081
app.listen(PORT, ()=> {
	console.log("Conectando na porta: " + PORT)
})