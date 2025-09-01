Database expectations (MySQL):

Products table should include these columns:

```
id VARCHAR(32) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
description TEXT NULL,
price DECIMAL(10,2) NOT NULL,
category_id VARCHAR(32) NOT NULL,
category_name VARCHAR(255) NOT NULL,
is_featured TINYINT(1) NOT NULL DEFAULT 0,
image_url VARCHAR(512) NULL,
image_public_id VARCHAR(255) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

Orders table columns:
```
id VARCHAR(32) PRIMARY KEY,
name VARCHAR(255) NOT NULL,
phone VARCHAR(32) NOT NULL,
street_address VARCHAR(255) NOT NULL,
city VARCHAR(128) NOT NULL,
postal_code VARCHAR(32) NOT NULL,
special_instructions TEXT NULL,
payment_method VARCHAR(32) NOT NULL DEFAULT 'COD',
status VARCHAR(32) NOT NULL DEFAULT 'pending',
items JSON NULL,
total_amount DECIMAL(10,2) NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```


