CREATE TABLE patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone1 VARCHAR(20),
    phone2 VARCHAR(20),
    health_insurance VARCHAR(100)
);

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'nurse', 'staff') NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE administrative_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    notes TEXT
);

CREATE TABLE medical_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    notes TEXT
);

CREATE TABLE appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    surgery VARCHAR(255) NOT NULL,
    intraocular_lens VARCHAR(255),
    admin_status_id INT NOT NULL,
    medical_status_id INT NOT NULL,
    admin_notes TEXT,
    nurse_notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_status_id) REFERENCES administrative_status(id),
    FOREIGN KEY (medical_status_id) REFERENCES medical_status(id)
);

CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    affected_entity VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
