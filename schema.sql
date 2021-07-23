DROP DATABASE IF EXISTS emptrack_db;

CREATE DATABASE emptrack_db;

USE emptrack_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments (id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    INDEX role_ind (role_id),
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE,
    man_id INT,
    FOREIGN KEY (man_id) REFERENCES employee (id) ON DELETE SET NULL,
    PRIMARY KEY (id)
);

INSERT INTO departments (dept_name) VALUES ("Management"), ("HR"), ("Production"), ("P Mayhem");

INSERT INTO roles (title, salary, dept_id) VALUES ("Manager", 650000, 1), ("Project Manager", 700000, 2), ("Soap Specialist", 500000, 3), ("Project Developer", 20000, 4);

INSERT INTO employee (first_name, last_name, role_id, man_id) VALUES ("Julian", "Pedraza", 1, NULL), ("Robert", "Paulson", 2, 1), ("Tyler", "Durden", 3, 1), ("Marla", "singer", 4, 1);
