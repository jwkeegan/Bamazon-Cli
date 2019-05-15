DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price DECIMAL(10,2),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Protein Powder", "Home", 47.99, 250);
    
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Bamazon Becho", "Home", 39.99, 2000);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Smart Plug", "Home", 10.00, 1150);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Keurig", "Home", 99.99, 500);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Security Camera", "Electronics", 249.99, 150);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("RGB Mechanical Keyboard", "Electronics", 79.99, 750);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Bamazon Fire Tablet", "Electronics", 77.99, 2500);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Wireless Router", "Electronics", 53.49, 200);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Camera", "Electronics", 299.99, 75);
 
 INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("MTG Booster Packs", "Games", 35.79, 120);
 