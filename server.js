/**
 * Arquivo: server.js
 * Descrição: 
 * Author:
 * Data de Criação: 19/03/2018
 * 
 */


 // Configurar o Setup da App:

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird');
var Produto = require('./app/models/produto')

mongoose.connect("mongodb://admin:sempre123@ds117719.mlab.com:17719/teste1", {
    useMongoClient: true
});


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.port || 8000

// Rotas das nossas API:
// ++=======================+++=================+++++===========

var router = express.Router()

router.use(function(req, res, next) {
    console.log("Algo está acontecendo aqui... ");
    next();
})

router.get('/', function(req, res) {
    res.json({ message: 'Seja bem vindo a Loja Testes' })
})

router.route('/produtos')
.post(function(req, res) {
    var produto = new Produto();
    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.descricao = req.body.descricao;

    produto.save(function(error) {
        if(error)
            res.send(error)

        res.json({ message: "Produto cadastrado com sucesso!" })
    })
})
.get(function(req, res) {
    Produto.find(function(error, produtos) {
        if(error)
            res.send(error);

        res.json(produtos);
    })
});


router.route('/produtos/:produto_id')
.get(function (req, res) {
    Produto.findById(req.params.produto_id, function(error, produto) {
        if(error)
            res.send("Id do produto não encontrado");

        res.json(produto);
    })
})
.put(function(req, res) {
    Produto.findById(req.params.produto_id, function(error, produto) {
        if(error)
            res.send("Erro no processamento")

        produto.nome = req.body.nome
        produto.preco = req.body.preco
        produto.descricao = req.body.descricao
        
        produto.save(function(error) {
            if(error)
                res.send("Erro na hora de atualizar o produto")
            
            res.json({ message: "Produto atualizado com sucesso" })
        })
    })
})


app.use('/api', router);

app.listen(port)
console.log("Iniciando a app na porta " + port);