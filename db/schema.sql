DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;
USE employee_db;
-- creating the different tables the user can navigate into
CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL);


CREATE TABLE roles (
    role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id));    


CREATE TABLE employees (
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, 
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
    -- FOREIGN KEY (role_id) REFERENCES roles(role_id)
    );

SELECT employees.first_name, 
	employees.last_name,
	roles.title AS Title,
    roles.salary AS Salary,
    departments.name AS Department
FROM employees 
	INNER JOIN roles ON employees.role_id=roles.role_id
    INNER JOIN departments ON employees.role_id=departments.department_id;   