DROP bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id int auto_increment not null,
    product_name varchar(30) not null,
    department_id int not null,
    price int not null,
    stock_quantity int(5),
    primary key (item_id)
);

CREATE TABLE departments (
	department_id int auto_increment not null,
    department_name varchar(30) not null,
	over_head_costs decimal(11,2),
    primary key (department_id)	
);

INSERT INTO departments (department_name, over_head_costs)
VALUE ('Houseware', 10000.00), ('Sports', 8000.00), ('Outerwear', 5000.00);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUE ('Tupperware', 1, 12.99, 24), ('Golf Clubs', 2, 129.99, 12), ('Vest S', 3, 24.99, 6), ('Vest M', 3, 24.99, 8), ('Vest L', 3, 24.99, 12), ('Vest XL', 3, 24.99, 4);

