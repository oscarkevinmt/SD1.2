const Order = require('../../../models/order')
const moment = require('moment')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const axios = require('axios');
var data = []

function orderController () {
    return {
        
        store(req, res) {
            // Validate request
            const { tarjeta, monto, pin, paymentType, concepto } = req.body
            const order = new Order({
                customerId: req.user._id,
                tarjeta,
                pin,
                monto,
                concepto,
            })
            
                
                    // req.flash('success', 'Order placed successfully')

                    // Stripe payment
                    if(paymentType === 'card') {

                        console.log("Si jala aqui x1")
                        axios.post('https://apibanco12.herokuapp.com/transaction', {
                            data: {
                                senderCard: tarjeta,
                                senderPin: pin,
                                amount: monto,
                                concept: concepto ,
                            }
                          })
                        .then(() => {
                            
                                console.log("Y AQUI? OKIS")
                                return res.json({ message : 'Pago Exitoso, Pedido Completado' });
                           

                        })
                        // .catch((err) => {
                        //     delete req.session.cart
                        //     return res.json({ message : 'OrderPlaced but payment failed, You can pay at delivery time' });
                        // })
                    } else {
                // CUANDO SEA TARJETA MOSTRAR LOS TEXTBOX,QUE EL PAGO SEA EN LA SECCION TARJETA Y NO EFECTIVO ,INCLUIR CONCEPTO
                        console.log("Si jala aqui x2")
                        axios.post("https://apibanco12.herokuapp.com/transaction", {
                            senderCard: tarjeta,
                            senderPin: pin,
                            amount: monto,
                            concept: concepto,
                        })
                        .then((response) => {
                            console.log(response);
                        }, (error) => {
                            console.log(error);
                            }); 

               //
                        delete req.session.cart
                        return res.json({ message : 'Pago exitoso' });
                        //console.log(response)
                        }
}
        ,
        async index(req, res) {
            // const orders = await Order.find({ customerId: req.user._id },
            //     null,
            //     { sort: { 'createdAt': -1 } })
            // var orden = [
            //     {id:1, nombre: 'diego', edad:22}
            // ]
            axios.get("https://apiordd.azurewebsites.net/")
                .then((getResponse) => {
                    //console.log("GET Response")
                    //console.log(getResponse.data);
                    data = getResponse.data;
                    //response.send(data);
                    res.header('Cache-Control', 'no-store')
                    res.render('customers/orders', { data:data, moment: moment })
                })           
                    
                // })
                // .catch(error=>{
                // console.log(error);
                // });  
            
            
        },
        async show(req, res) {
            const idOrd = req.params.id_Ordendom
            //const passId = data[idOrd-1].id_Ordendom
            var passId = 0;
            for(var i=0; i < data.length; i++){
                if(data[i].id_Ordendom == idOrd){
                    passId = data[i].id_Ordendom
                }
            }
            // Authorize user
            // if(req.user._id.toString() === order.customerId.toString()) {
            //     return res.render('customers/singleOrder', { order })
            // }
            
            //console.log(data[idOrd-1].id_Ordendom)
            console.log(passId)
            // for(var i = 0; i < data.length; i++){
            //     console.log(data[i].id_Orden)
            //     var request = req.data[i].id_Orden;
            if(passId == idOrd){
                return res.render('customers/singleOrder', { passId, data })
            }
            //} del for
            //  if(data[x].id_Orden === '1'){
            //      console.log("Si jala")
            //     return res.render('customers/singleOrder', { data })
            //  }
            //  console.log("No jala")
            // return  res.redirect('/')
            
        },
        async changeStatus(req, res){
            //const status = req.params.estado // PENDIENTE OR INICIADA
            const idOrd = req.params.id_Ordendom

            for(var i=0; i < data.length; i++){
                if(data[i].id_Ordendom == idOrd){
                    data[i].estado = 'ENTREGADA'
                }
            }
            return res.render('customers/orders', {data})
        }
    }
}

module.exports = orderController