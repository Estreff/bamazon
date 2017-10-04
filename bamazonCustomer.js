var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'bamazon'
});
 
inquirer
    .prompt([
        {
         type: 'input',
         name: 'product',
         message: 'What would you like to buy (Product ID)?'
        }
    ]).then(function(purchase) {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'quantity',
                        message: 'How many would you like to buy?'
                    }
                ]).then(function(ordered){
                    var qtyOrdered = ordered.quantity;
                    console.log(`Ordered Quantity: ${qtyOrdered}`);
                    connection.connect();
                    
                    connection.query(`SELECT * FROM bamazon.products where item_id = ${purchase.product}`, function (error, results, fields) {
                    if (error) throw error;
                        var qtyAvail = results[0].stock_quantity;
                        if(qtyAvail < qtyOrdered) {
                            console.log('Insufficient Quantity available!!');
                            connection.end();
                            return;
                        } else {
                            var newStockQty = qtyAvail - qtyOrdered;
                            console.log('Your order has been placed!!');
                                connection.query(`UPDATE products SET stock_quantity = ${newStockQty} WHERE item_id = ${purchase.product}`, function (error, results, fields) {
                                    if (error) throw error;
                                    connection.end();
                                    return;
                                });
                        } 
                    });
                });
    });