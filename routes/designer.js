const express=require('express')
const router=express.Router()

// invocamos al modulo de la base de datos
const connection=require('../database/db');

// rutas

router.get('/designer',(req,res)=>{
    if(req.session.loggedin){
        res.render('designer',{            
            login:true,
            name:req.session.name
        });
    }else{
        res.render('designer',{            
            login:false            
        });
    }
})

module.exports=router