const express=require('express')
const router=express.Router()

// invocamos al modulo de la base de datos
const connection=require('../database/db');

// funciones

function productoEnCarrito(carrito,id){
    for(let i=0; i<carrito.length; i++){
        if (carrito[i].idProducto==id){
            return true;
        }
    }
    return false;
}

function calcularTotal(carrito, req){
    total=0;
    for(let i=0; i<carrito.length;i++){
        total=total + (carrito[i].precio*carrito[i].cantidad);
    }
    req.session.total=total;
    return total;
}

// rutas
router.get('/shop',(req,res)=>{
    connection.query('SELECT * FROM productos', (error, products) => {
        if (error) throw error;       
        if(req.session.loggedin){
            // busca en el carrito
            var cant=0
            if (req.session.carrito){
                var cart = req.session.carrito
                cant = cart.length;
                console.log(cart.length)
            }
            const user = req.session.name
            res.render('shop',{
                    productos: products,
                    carrito:true,                    
                    login:true,
                    name:req.session.name,
                    cant:cant
                });
            }else{
                res.render('shop',{
                    productos: products,
                    carrito: false,
                    login:false,
                    cant:0
                    //name:req.session.name
                });
            }   
        })  
 
}); 


router.post('/agregar', (req,res)=>{      
    if (req.session.name){
        var id= req.body.idProducto
        var nombre= req.body.nombre
        var precio= req.body.precio
        var imagen= req.body.imagen
        var cantidad= req.body.cantidad
        var producto = {idProducto:id,nombre:nombre,precio:precio,imagen:imagen,cantidad:cantidad}                
        if (req.session.carrito){
            var carritos = req.session.carrito;
            if (!productoEnCarrito(carritos,id)){
                carritos.push(producto);
            }
        }else{
            req.session.carrito=[producto];
            var carritos = req.session.carrito;
        }
        // calcular el total
        calcularTotal(carritos,req);

        // ir a pagina carrito
        connection.query('SELECT * FROM productos', (error, products) => {       
            const user = req.session.name 
            connection.query('SELECT COUNT(*) as cantidad FROM carrito WHERE idCliente = ?',[user], async (error,results)=>{            
                res.render('carrito',{
                    cart:true,
                    carritos:carritos,
                    carrito:true,
                    cantidad:results[0].cantidad,
                    login:true,
                    name:req.session.name,
                    alert:true,
                    alertTitle: "Productos",
                    alertMessage: "producto agregado al carrito",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1800,
                    ruta:'carrito'
                })
            })
        })    
    }else{
        res.render('login',{
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Debe iniciar session",
            alertIcon: 'warning',
            showConfirmButton:false,
            timer:1800,
            ruta:'login'
        })
    }
})

module.exports=router