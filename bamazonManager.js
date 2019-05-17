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
            switch(answer.managerDuty) {
                case "View Products for Sale": 
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addToCurrent();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
            };
        });
});

function addNewProduct() {
    console.log("Here's a new product");
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "Input product name:"
            },
            {
                name: "department",
                type: "input",
                message: "Input department"
            },
            {
                name: "price",
                type: "input",
                message: "Input price",
                validate: validateNumber()
            },
            {
                name: "quantity",
                type: "input",
                message: "Input stock quantity",
                validate: validateNumber()
            }
        ])
        .then(function (answer) {
            connection.query("INSERT INTO products SET ?", {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantity
            }, function (err) {
                if (err)
                    throw err;
                console.log("Product added successfully");
                connection.end();
            });
        });
}

function validateNumber() {
    return function (value) {
        if (isNaN(value) === false) {
            return true;
        }
        return false;
    };
}

function addToCurrent() {
    console.log("Adding inventory");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err)
            throw err;
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
                validate: validateNumber()
            }
        ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.product) {
                        chosenItem = res[i];
                    }
                }
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: (parseInt(answer.amount) + chosenItem.stock_quantity)
                    },
                    {
                        product_name: answer.product
                    }
                ]);
                connection.end();
            });
    });
}

function viewLowInventory() {
    console.log("Low inventory here");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err)
            throw err;
        if (res.length === 0) {
            console.log("Inventory fully stocked!");
        }
        else {
            console.table(res);
        }
        ;
        connection.end();
    });
}

function viewProducts() {
    console.log("Here are the products");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function (err, res) {
        if (err)
            throw err;
        console.table(res);
        connection.end();
    });
}
