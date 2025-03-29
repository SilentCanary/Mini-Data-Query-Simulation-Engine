DROP TABLE IF EXISTS sales;

CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    total_amount REAL GENERATED ALWAYS AS (quantity * price) STORED,
    sale_date TEXT NOT NULL
);

INSERT INTO sales (product, category, quantity, price, sale_date) VALUES 
('Laptop', 'Electronics', 2, 1000.50, '2024-03-28'),
('Phone', 'Electronics', 5, 500.75, '2024-03-28'),
('Tablet', 'Electronics', 3, 300.25, '2024-03-27'),
('Headphones', 'Accessories', 10, 50.00, '2024-03-26'),
('Monitor', 'Electronics', 1, 200.99, '2024-03-25'),
('Keyboard', 'Accessories', 7, 25.99, '2024-09-05'),
('Mouse', 'Accessories', 15, 20.49, '2024-03-23'),
('Smartwatch', 'Wearables', 4, 150.00, '2024-03-22');
