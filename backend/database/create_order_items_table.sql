CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  size VARCHAR(20) NULL,      -- for Pizza (Small/Medium/Large)
  pieces INT NULL,            -- for Chicken Fries (6,12,24)
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);