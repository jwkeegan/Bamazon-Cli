// Require npm packages
var inquirer = require("inquirer");
var mysql = require("mysql");

// connect to database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;

    displayProducts();
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        dataPrint(res);
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Choose id of product to purchase"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many do you want to buy?"
            }
        ]).then(function (response) {
            var id = parseInt(response.id);
            var quantity = parseInt(response.quantity);
            var validID = checkID(res, id);
            var validQuantity = checkQuantity(res, id, quantity);

            if (!validID) {
                console.log("That's not a valid item to choose!");
                displayProducts();
            } else if (!validQuantity) {
                console.log("There's not enough in stock to fill that order");
                displayProducts();
            } else {
                updateProduct(id, quantity);
            }
        });
    });
}

// function to log a table of the available products
// adds spacing between product name and price based on length of name
function dataPrint(data) {
    console.log("id #\tProduct Name\t\t\tPrice");
    console.log("--------------------------------------------------")
    for (i = 0; i < data.length; i++) {
        var id = data[i].item_id + "\t";
        var name = data[i].product_name;
        if (name.length < 8) name += "\t\t\t\t";
        else if (name.length < 16) name += "\t\t\t";
        else if (name.length < 24) name += "\t\t";
        else name += "\t";
        var price = data[i].price;
        console.log(id + name + price);
    }
}

// function to check if id exists in the current database
function checkID(data, id) {
    for (i = 0; i < data.length; i++) {
        if (data[i].item_id == id) return true;
    }
    return false;
}

// function to check if there is enough in stock to fill customer order
function checkQuantity(data, id, quantity) {
    for (i = 0; i < data.length; i++) {
        if (data[i].item_id == id) {
            if (data[i].stock_quantity >= quantity) return true;
            else return false;
        }
    }
    return false;
}

function updateProduct(id, quantity) {
    var formerQuantity = 0;
    connection.query("SELECT * FROM products WHERE ?",
        {
            item_id: id
        },
        function (err, response) {
            if (err) throw err;

            formerQuantity = response[0].stock_quantity;
            var newQuantity = formerQuantity - quantity;
            var totalCost = quantity * response[0].price;

            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        item_id: id
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log("Purchase Successful! Total Cost: " + totalCost);
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "choice",
                            choices: ["Continue Shopping", "Exit"],
                            message: "Would you like to buy more?"
                        }
                    ]).then(function (response) {

                        switch (response.choice) {
                            case "Continue Shopping":
                                displayProducts();
                                break;
                            case "Exit":
                                connection.end();
                                break;
                        }
                    })
                }
            );

        }
    );
}