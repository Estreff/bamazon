var inquirer = require('inquirer');
var mysql = require('mysql');
var AsciiTable = require('ascii-table');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'bamazon'
});

inquirer
    .prompt([
        {
            type: 'list',
            name: 'menuResult',
            message: 'What would you like to do?',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add Inventory', 'Add New Product', 'Exit']    
        }
    ]).then(function(menu){   
        var operator = menu.menuResult;
        connection.connect();

        if(operator === 'View Products for Sale'){
            connection.query(`select products.item_id, products.product_name,  departments.department_name, products.price, products.stock_quantity, products.product_sold, products.product_sales
            from products
            left join departments on products.department_id = departments.department_id`,
            function (error, results, fields) {
                if (error) throw error;
                    var table = new AsciiTable('Products for Sale');
                    
                    table.setHeading('Item ID', 'Product Name', 'Dept Name', 'Sale Price', 'QTY OH', 'Products Sold', 'Product Sales');

                        for(var i = 0; i < results.length; i++) {
                            table.addRow(results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sold, results[i].product_sales);
                        }
                        console.log(table.toString());
                    connection.end();
            });

        }else if(operator === 'View Low Inventory'){ 
            connection.query(`select products.item_id, products.product_name,  departments.department_name, products.price, products.stock_quantity, products.product_sold, products.product_sales
            from products
            left join departments on products.department_id = departments.department_id
            where products.stock_quantity < 5`,
            function (error, results, fields) {
                if (error) throw error;
                    var minTable = new AsciiTable('Min/Max Report');
                    minTable.setHeading('Item ID', 'Product Name', 'Dept Name', 'Sale Price', 'QTY OH', 'Products Sold', 'Product Sales');
                
                    for(var i = 0; i < results.length; i++) {
                        minTable.addRow(results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sold, results[i].product_sales);
                    }
                    console.log(minTable.toString());
                connection.end();
            });
            
        }else if(operator === 'Add Inventory'){
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'addProduct',
                        message: 'What Product would you like to receive more of? (Product ID)?'
                    },
                    {
                        type: 'input',
                        name: 'addQuantity',
                        message: 'How many would you like to receive?'
                    }
                ]).then(function(receive) {
                    var receiveProduct = receive.addProduct;
                    var receiveQuantity = parseFloat(receive.addQuantity);

                    connection.query(`SELECT * FROM bamazon.products where ?`,
                        {
                            item_id: receiveProduct
                        }, function (error, results, fields) {
                        if (error) throw error; 
                        var productOH = results[0].stock_quantity;
                        var productName = results[0].product_name;
                        var addQuantity = productOH + receiveQuantity;

                        connection.query(`UPDATE products SET ? WHERE ?`,
                        [{stock_quantity:  addQuantity
                        },
                            {item_id: receiveProduct
                        }], function (error, results, fields) {
                            if (error) throw error; 
                            console.log(`You have received ${receiveQuantity} of productID ${receiveProduct} to give you a total of ${addQuantity} ${productName}`);
                            connection.end();
                        });
                    });
                });

        }else if(operator === 'Add New Product'){
            connection.query(`SELECT * FROM bamazon.departments ORDER BY department_name`, function (error, results, fields) {
            if (error) throw error;

            var deptNames = [];
                for(var i = 0; i < results.length; i++) {
                    var deptObject = results[i].department_name;
                    deptNames.push(deptObject);
                }
                // console.log(deptNames);
                inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'productName',
                        message: 'What is the name of the product you would like to create?'
                    },
                    {
                        type: 'list',
                        name: 'departmentName',
                        message: 'What department does this belong in?',
                        choices: deptNames
                    },
                    {
                        type: 'input',
                        name: 'price',
                        message: 'How much will this cost our customer?'
                    },
                    {
                        type: 'input',
                        name: 'stock',
                        message: 'How much stock would you like to add?'
                    }
                ]).then(function(deptLookup) {
                    var deptFind = deptLookup.departmentName;
                    connection.query(`SELECT * FROM departments WHERE ?`, {
                        // SELECT * FROM departments WHERE department_name='Kitchen'
                        department_name: deptFind
                    }, function (error, results, fields) {
                        if (error) throw error;
                        var deptID = results[0].department_id;
                   
                        post = {
                            'product_name': deptLookup.productName,
                            'department_id': deptID,
                            'price': deptLookup.price,
                            'stock_quantity': deptLookup.stock
                        };
                        connection.query(`INSERT INTO bamazon.products SET ?`, post, function (error, results, fields) {
                            if (error) throw error;
                            console.log(`You have added ${deptLookup.stock} ${deptLookup.productName} into the ${deptLookup.departmentName} at the price of ${deptLookup.price}`);
                            connection.end();
                        });
                    });
                });
            });
            }else {
                connection.end();
            return;
        }       
    });