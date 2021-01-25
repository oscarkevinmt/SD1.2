const order = require("../../../models/order")
const Order = require('../../../models/order')
const axios = require('axios');


function orderController() {
    return {
        index(req, res) {
            //populate('customerId', '-password') , { sort: { 'createdAt': -1 }}
           order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
               if(req.xhr) {
                   return res.json(orders)
               } else {
                return res.render('admin/orders')
               }
           })
        }
    }
}

module.exports = orderController