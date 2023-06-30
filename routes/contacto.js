const express=require('express')
const router=express.Router()

// invocamos al modulo de la base de datos
const connection=require('../database/db');

// rutas

router.get('/contacto',(req,res)=>{
    if(req.session.loggedin){
        res.render('contacto',{            
            login:true,
            name:req.session.name
        });
    }else{
        res.render('contacto',{            
            login:false            
        });
    }
})

module.exports=router