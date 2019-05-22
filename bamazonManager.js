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

    managerDisplay();
});

function managerDisplay() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Hello, Manager! Choose one of the following options",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (response) {
        switch (response.choice) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
        }
    });
}

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        dataPrint(res);
        managerDisplay();
    });
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (res.length > 0) dataPrint(res);
        else console.log("All Inventory at Acceptable Quantity!");
        managerDisplay();
    });
}

function addInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        dataPrint(res);
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Choose id of product you want to add."
            },
            {
                type: "input",
                name: "quantity",
                message: "How much inventory do you want to add?"
            }
        ]).then(function (response) {
            var id = parseInt(response.id);
            var quantity = parseInt(response.quantity);
            var validID = checkID(res, id);

            if (!validID) {
                console.log("That's not a valid item to choose!");
                managerDisplay();
            } else {
                updateProduct(id, quantity);
            }

        });

    });
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What product are you adding?"
        },
        {
            type: "input",
            name: "department",
            message: "What department does it go to?"
        },
        {
            type: "input",
            name: "price",
            message: "How much does one unit cost?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many are you putting in stock?"
        }
    ]).then(function (response) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: response.name,
                department_name: response.department,
                price: response.price,
                stock_quantity: response.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
                managerDisplay();
            }
        );
    })


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

function checkID(data, id) {
    for (i = 0; i < data.length; i++) {
        if (data[i].item_id == id) return true;
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
            var newQuantity = formerQuantity + quantity;

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
                    console.log("Inventory Added!");
                    managerDisplay();
                }
            );

        }
    );
}