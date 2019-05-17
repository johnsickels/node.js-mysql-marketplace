var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    inquirer
        .prompt ({
            name: "supervisorDuty",
            type: "list",
            message: "Select supervisor task:",
            choices: [
                "View Product Sales by Department",
                "Create New Department"
            ]
        })
        .then(function (answer) {
            switch(answer.supervisorDuty) {
                case "View Product Sales by Department":
                    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON (departments.department_name = products.department_name)", function(err, res) {
                        if (err) throw err;
                        console.table(res);
                        connection.end();
                    });
                    break;
                case "Create New Department":

                    break;
            }
        })
    
})