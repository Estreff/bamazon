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

        if(todo === 'View Products Sales by Department') {
            console.log('What Department would you like to see?' )

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