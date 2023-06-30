const express=require('express')
const router=express.Router()

// invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

// invocamos al modulo de la base de datos
const connection=require('../database/db');

//rutas


router.get('/registrar',(req,res)=>{
    res.render('registrar')
})

router.post('/registrar',async (req,res)=>{
    const user= req.body.user;
    const name= req.body.name;
    const rol= req.body.rol;    
    const pass= req.body.pass;
    let passwordHash = await bcryptjs.hash(pass,8);
    connection.query('INSERT INTO user SET ?',{user:user, name:name, rol:rol, pass:passwordHash},async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            //res.send('ALTA EXITOSA')
            res.render('registrar',{
                alert:true,
                alertTitle: "Registracion",
                alertMessage: "Registracion Exitosa",
                alertIcon: 'success',
                showConfirmButton:false,
                timer:1600,
                ruta:''
            })
        }
    })
})

module.exports=router