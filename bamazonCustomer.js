    
 
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
                    var qtyOrdered = parseFloat(ordered.quantity);
                    console.log(`Ordered Quantity: ${qtyOrdered}`);
                    connection.connect();
                    
                    connection.query(`SELECT * FROM bamazon.products where ?`,
                    {
                        item_id: purchase.product
                    },
                        function (error, results, fields) {
                    if (error) throw error;
                        var qtyAvail = results[0].stock_quantity;
                        var currentSales = results[0].product_sales;
                        var salePrice = results[0].price;
                        var currentSold = results[0].product_sold;
                        if(qtyAvail < qtyOrdered) {
                            console.log('Insufficient Quantity available!!');
                            connection.end();
                            return;
                        } else {
                            var newStockQty = qtyAvail - qtyOrdered;
                            var qtySold = currentSold + qtyOrdered;
                            var newSales = currentSales + (qtyOrdered * salePrice);
                            console.log('Your order has been placed!!');
                                connection.query(`UPDATE products SET ? WHERE ?`,
                                    [{
                                        stock_quantity: newStockQty,
                                        product_sales: newSales,
                                        product_sold: qtySold
                                    },
                                    {
                                        item_id: purchase.product
                                    }], function (error, results, fields) {
                                    if (error) throw error;
                                    connection.end();
                                    return;
                                });
                        } 
                    });
                });
    });