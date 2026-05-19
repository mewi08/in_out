CREATE TABLE work_area (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE users(
	id 				INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name			VARCHAR(100) NOT NULL,
    last_name		VARCHAR(100) NOT NULL,
    dni			 	CHAR (8) UNIQUE NOT NULL,
	category		VARCHAR(50) NOT NULL,
    work_area_id 	INT UNSIGNED NOT NULL,
    code 			VARCHAR(10) UNIQUE NOT NULL,
    role 			ENUM('admin', 'employee') DEFAULT 'employee' NOT NULL,
    is_active		BOOLEAN DEFAULT TRUE,
    created_at		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    foreign key (work_area_id) references work_area(id)
)ENGINE = InnoDB;

CREATE TABLE attendance_records(
	id 				INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id			INT UNSIGNED NOT NULL,
    type 			ENUM('check_in','check_out') NOT NULL,
    time_stamp		DATETIME NOT NULL,
    created_at 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
)ENGINE = InnoDB;

CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    user_id INT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);