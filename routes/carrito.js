const express=require('express')
const router=express.Router()

// invocamos al modulo de la base de datos
const connection=require('../database/db');

// funciones

function calcularTotal(carrito, req){
    total=0;
    for(let i=0; i<carrito.length;i++){
        total=total + (carrito[i].precio*carrito[i].cantidad);
    }
    req.session.total=total;
    return total;
}

// rutas

router.get('/carrito',(req,res)=>{
    if(req.session.loggedin && req.session.carrito){
        // busca en el carrito
        var carritos = req.session.carrito;
        var total = req.session.total;
        const user = req.session.name       
        res.render('carrito',{
            cart:true,
            carritos:carritos,
            total:total,
            login:true,
            name:req.session.name
            });
    }else{
        res.render('carrito',{
            cart:false,
            login:true,
            name:req.session.name,
            alert:true,
            alertTitle: "Productos",
            alertMessage: "No tiene nada agregado al carrito",
            alertIcon: 'warning',
            showConfirmButton:false,
            timer:1800,
            ruta:'shop'
        });
    }    
})

router.post('/quitarProducto',(req,res)=>{
    var id=req.body.id;
    var carritos = req.session.carrito;
    for(let i=0;i<carritos.length;i++){
        if(carritos[i].idProducto==id){
            carritos.splice(carritos.indexOf(i),1);
        }
    }
    // recalcular total

    calcularTotal(carritos,req);
    res.redirect('carrito')
})

router.post('/editarCantidad',(req,res)=>{
    var id=req.body.id;
    var cant=req.body.cantidad;
    var incrementar_btn=req.body.incrementar;
    var decrementar_btn=req.body.decrementar;
    var carritos = req.session.carrito;

    if (incrementar_btn){
        for(let i=0; i<carritos.length; i++){
            if (carritos[i].idProducto==id){
                if (carritos[i].cantidad>0){
                    carritos[i].cantidad=parseInt(carritos[i].cantidad)+1;
                }
            }
        }
    }

    if (decrementar_btn){
        for(let i=0; i<carritos.length; i++){
            if (carritos[i].idProducto==id){
                if (carritos[i].cantidad>1){
                    carritos[i].cantidad=parseInt(carritos[i].cantidad)-1;
                }
            }
        }
    }
    calcularTotal(carritos,req);
    res.redirect('carrito')
})

router.post('/comprar',(req,res)=>{
    var nombre= req.body.nombre;
    var mail= req.body.mail;
    var telefono = req.body.telefono;
    var direccion = req.body.direccion;
    var pago = req.session.total;
    var fecha = new Date();

    connection.query('INSERT INTO pedidos SET ?',{nombreCliente:nombre,mail:mail,direccion:direccion,telefono:telefono,fechaPedido:fecha,importe:pago},async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            // limpiamos datos del carrito
            total=0;
            req.session.total=total;
            req.session.carrito=[];
            // agradecimiento
            res.render('pago',{
                alert:true,
                alertTitle: "Compra",
                alertMessage: "Muchas gracias por tu compra",
                alertIcon: 'success',
                showConfirmButton:false,
                timer:1800,
                ruta:''
            })
        }
    })
})
    
    


module.exports=router