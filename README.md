# Node.js-MySQL-Marketplace

## Overview

In this activity, I will be creating an Amazon-like storefront with my MySQL skills. The app will take in orders from customers and deplete stock from the store's inventory.

This app will require the MySQL and Inquirer npm packages in the GitHub repo--the app will need them for data input and storage.

### Customer View

Running this application will first display all of the items available for sale. Including the ids, names, and prices of products for sale.

The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, the application should check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

However, if your store _does_ have enough of the product, the app should fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.

- - -

## Technologies used:

* JavaScript

* Node.js

* MySQL

* Inquirer NPM

## Bamazon Links:

![Bamazon](Images/bamazon.gif)
