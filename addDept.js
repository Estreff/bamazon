var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'bamazon'
});

function addDept(){
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
                message: 'How much overhead is there in this department? Format(xxx.xx)'
            }
        ]).then(function(create) {
            connection.query(`SELECT * FROM bamazon.departments`, function(error, results, fields) {
                for(var i = 0; i<results.length; i++) {
                    if(results[i].department_name.toLowerCase() === create.departmentName.toLowerCase()) {
                        console.log(`${create.departmentName} already exists`);
                        connection.end();
                        return;
                    }
                }
                post = {
                    'department_name': create.departmentName,
                    'over_head_costs': create.overHead
                };
                connection.query(`INSERT INTO bamazon.departments SET ?`, post, function (error, results, fields) {
                    if (error) throw error;
                    console.log(`You have added ${create.departmentName} with an over head of $${create.overHead}.`);
                    connection.end();
                });               
            });
        });
}

module.exports = addDept;