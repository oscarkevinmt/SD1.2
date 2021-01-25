const axios = require('axios');

let users = []; // names of users will be stored here
    
axios.get("https://backend-ventas.herokuapp.com/api/sales/paid")
    .then( ({data})  => {
        users = data.sales.map(user => "Orden: "+ user.id_order +" | Monto: "+ user.amount +" | Metodo de pago: "+user.pay_method ); // get only the names of the users and store in an array
            console.log(users)
        })
        .catch(error=>{
            console.log(error);
        });  
// fetch('orden.json')
//     .then(function (res){
//         return res.json();
//     })
//     .then(function (data){
//         appendData(data);
//     })
//     .catch(function (err){
//         console.log(err)
//     });

// function appendData(data){
//     var mainContainer = document.getElementById("myData");
//     for (var i = 0; i < data.length; i++) {
//         var table = document.createElement("table");
//         table.innerHTML = 'celular' + data[i].celular + ' ' + data[i].direccion + ' ' + data[i].tipopago;
//         mainContainer.appendChild(table);
//     }
// }