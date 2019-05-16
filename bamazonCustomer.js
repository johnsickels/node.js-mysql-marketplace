var mysql = require("mysql");
var inquirer = require("inquirer");

var stockQuantity;
var price;
var total;

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
    // Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        // The app should then prompt users with two messages.
        inquirer
            .prompt([
                {
                    // The first should ask them the ID of the product they would like to buy.
                    name: "choice",
                    type: "input",
                    message: "Please enter the ID of the product you would like to buy: "
                },
                {
                    // The second message should ask how many units of the product they would like to buy.
                    name: "amount",
                    type: "input",
                    message: "How many units of the product would you like to buy?"
                }
            ])
            .then(function (answer) {
                // Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
                console.log("Item ID: " + answer.choice);
                console.log("Units to purchase: " + answer.amount);
                connection.query("SELECT * FROM products WHERE ?", { item_id: answer.choice }, function (err, res) {
                    if (err) throw err;
                    stockQuantity = res[0].stock_quantity;
                    price = res[0].price;
                    // console.log("Current quantity: " + stockQuantity);
                    // If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
                    if (answer.amount > stockQuantity) {
                        console.log("Insufficient quantity!");
                    } else {
                        // However, if your store does have enough of the product, you should fulfill the customer's order.
                        // This means updating the SQL database to reflect the remaining quantity.
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: (stockQuantity - answer.amount)
                                },
                                {
                                    item_id: answer.choice
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                total = (answer.amount * price).toFixed(2);
                                
                                // Once the update goes through, show the customer the total cost of their purchase.
                                console.log("Grand Total: $" + total);
                            });
                    };
                    connection.end();
                });   
            });
    });
});

