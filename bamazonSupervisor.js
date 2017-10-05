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
            choices: ['View Products Sales by Department', 'Create New Department', 'Exit']    
        }
    ]).then(function(supervisor) {

        var todo = supervisor.menuResult;
        connection.connect();
        if(todo === 'View Products Sales by Department') {

            connection.query(
                `SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sold, products.product_sales, products.product_sales - departments.over_head_costs AS total_profit
                from departments
                left join products on departments.department_id = products.department_id
                group by departments.department_name
                order by departments.department_id`,
                function (error, results, fields) {
                if (error) throw error;

                var deptTable = new AsciiTable('Product Sales by Department')
                deptTable.setHeading('Dept ID', 'Department Name', 'Over Head Costs', 'Products Sold', 'Product Sales', 'Total Profit');
                
                    for(var i = 0; i < results.length; i++) {
                        deptTable.addRow(results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].product_sold, results[i].product_sales, results[i].total_profit);
                    }
                    console.log(deptTable.toString());
                // console.log(results);
                connection.end();

            });

        }else if(todo === 'Create New Department') {
            console.log('What department would you like to create?')
            inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'What department would you like to create?'
                },
                {
                    type: 'input',
                    name: 'overHead',
                    message: 'How much overhead is there in this department?'
                }
            ]).then(function(create) {
                post = {
                    'department_name': create.departmentName,
                    'over_head_costs': create.overHead
                };
                connection.query(`INSERT INTO bamazon.departments SET ?`, post, function (error, results, fields) {
                    if (error) throw error;
                    console.log(`You have added ${create.departmentName} with an over head of ${create.overHead}.`);
                    connection.end();
                });
            });
        } else {
            return;
        }
    });