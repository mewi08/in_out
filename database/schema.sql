DROP DATABASE IF EXISTS in_out;
CREATE DATABASE in_out;
USE in_out;

CREATE TABLE users(
	id 				INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name			VARCHAR(100) NOT NULL,
    last_name		VARCHAR(100) NOT NULL,
    dni          	CHAR(8)		UNIQUE NOT NULL,
    category		VARCHAR(50) NOT NULL,
    work_area        VARCHAR(50) NOT NULL,
    is_active		BOOLEAN DEFAULT TRUE,
    created_at		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    
)ENGINE = InnoDB;

CREATE TABLE attendance_records(
	id 				INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id			INT UNSIGNED NOT NULL,
    type 			ENUM('check_in','check_out') NOT NULL,
    time_stamp		DATETIME NOT NULL,
    code         	CHAR(8) NOT NULL,
    created_at 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)    
)ENGINE = InnoDB;

CREATE TABLE audit_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50),
    record_id INT UNSIGNED,
    action ENUM('INSERT', 'UPDATE', 'DELETE'),
    old_values JSON,
    new_values JSON,
    user_id INT UNSIGNED,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;
