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
        .prompt({
            name: "managerDuty",
            type: "list",
            message: "Select managerial task:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            if (answer.managerDuty === "View Products for Sale") {
                console.log("Here are the products");
                connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
                    if (err) throw err;
                    console.table(res);
                    connection.end();
                });

            } else if (answer.managerDuty === "View Low Inventory") {
                console.log("Low inventory here");
                connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
                    if (err) throw err;
                    if (res.length === 0) {
                        console.log("Inventory fully stocked!");
                    } else {
                        console.table(res)
                    };
                    connection.end();
                });

            } else if (answer.managerDuty === "Add to Inventory") {
                console.log("Adding inventory");
                connection.query("SELECT * FROM products", function (err, res) {
                    if (err) throw err;

                    inquirer.prompt([
                        {
                            name: "product",
                            type: "rawlist",
                            choices: function () {
                                var choiceArray = [];
                                for (var i = 0; i < res.length; i++) {
                                    choiceArray.push(res[i].product_name);
                                }
                                return choiceArray;
                            },
                            message: "Select product to update it's incentory:"
                        },
                        {
                            name: "amount",
                            type: "input",
                            message: "How many products would you like to add?",
                            validate: function (value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    ])
                        .then(function (answer) {
                            connection.query("UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock_quantity: answer.amount
                                    },
                                    {
                                        product_name: answer.product
                                    }
                                ])
                        })
                })

            } else if (answer.managerDuty === "Add New Product") {
                console.log("Here's a new product");

            }
        });

})