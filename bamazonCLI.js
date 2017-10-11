var inquirer = require('inquirer');
var mysql = require('mysql');
var AsciiTable = require('ascii-table');
var bamazonCustomer = require('./bamazonCustomer');
var bamazonManager = require('./bamazonManager');
var bamazonSupervisor = require('./bamazonSupervisor');


var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'bamazon'
});

inquirer
    .prompt([
        {
            type:'list',
            name: 'level',
            message: 'What access level do you have?',
            choices: ['Customer', 'Manager', 'Supervisor', 'Exit']
        }
    ]).then(function(access) {
        var accessLevel = access.level;
        console.log('Acess Level: ', accessLevel);

        if(access.level === 'Customer') {
            bamazonCustomer();
        }else if(access.level === 'Manager') {
            bamazonManager();
        }else if(access.level === 'Supervisor') {
            bamazonSupervisor();
        } else {
            return;
        }
    });