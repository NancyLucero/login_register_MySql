const express=require('express')
const router=express.Router()

// invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

// invocamos al modulo de la base de datos
const connection=require('../database/db');

router.get('/',(req,res)=>{
    if(req.session.loggedin){
        // busca en el carrito
        const user = req.session.name        
        connection.query('SELECT COUNT(*) as cantidad FROM carrito WHERE idCliente = ?',[user], async (error,results)=>{            
            if(results[0].cantidad!=0){
                res.render('index',{
                    carrito:true,
                    cantidad:results[0].cantidad,
                    login:true,
                    name:req.session.name
                });
            }else{
                res.render('index',{
                    carrito: false,
                    login:true,
                    name:req.session.name
                });
            }
        });
    }else{
        res.render('index',{
            login:false,
            //name:'Debe iniciar session'
            name:''
        })
    }
})

// autenticacion

router.post('/auth', async(req,res)=>{
    const user=req.body.user;
    const pass=req.body.pass;
    let passwordHash= await bcryptjs.hash(pass,8);
    if(user && pass){
        connection.query('SELECT * FROM user WHERE user = ?',[user], async (error,results)=>{
            if(results.length==0 || !(await bcryptjs.compare(pass,results[0].pass))){
                res.render('login',{
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Contraseña Incorrectas",
                    alertIcon: 'error',
                    showConfirmButton:false,
                    timer:1800,
                    ruta:'login'
                })
            }else{
                req.session.loggedin = true
                req.session.name=results[0].name
                req.session.id=results[0].idU
                res.render('login',{
                    alert:true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage: "Acceso Correcto",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1800,
                    ruta:'shop'
                })
            }
        })
    }else{
        res.render('login',{
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese un usuario y/o contraseña",
            alertIcon: 'warning',
            showConfirmButton:false,
            timer:1800,
            ruta:'login'
        })
    }
})

router.get('/login',(req,res)=>{
    res.render('login')
})

// logout
router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})
module.exports=router