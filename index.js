// PARTE DECLARATIVA

// invocamos a express
const express = require('express');
const app= express();
const bodyParser = require('body-parser');

// PARTE DE REQUIRE Y USE

// Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// Directorio publico
app.use('/resources',express.static('public'));
app.use('/resources',express.static(__dirname + 'public'));

// establecer el motor de plantillas ejs - 
app.set('view engine','ejs')

// seteamos urlencoded para capturar los datos del formulario
//app.use(bodyParser.urlencoded({extended:true}));

// seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// variables de session
const session= require('express-session');
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

// invocamos al modulo de la base de datos
const connection=require('./database/db');

// establecemos las rutas - navegacion

app.use('/',require('./routes/login'))

app.use('/',require('./routes/shop'))

app.use('/',require('./routes/carrito'))

app.use('/',require('./routes/registrar'))

app.use('/',require('./routes/designer'))

app.use('/',require('./routes/contacto'))

// iniciar servidor

app.listen(3000, ()=>{
    console.log('Servidor ejecutandose')
})