---
layout: blog
title: "Most Commonly Used PostgreSQL Commands"
date: 2025-05-04T12:37:35
author: Nguyen Nguyen
tags:
  - SQL
  - Database
reading_time: 17
category: Technology
thumbnail: /images/uploads/1746351941761-PostgreSQL-Commands.png
description: "Outlines the most frequently used PostgreSQL commands, grouped by function, with practical examples to help you get started. These commands are executed via the `psql` command-line interface or GUI tools like pgAdmin."
---


PostgreSQL, a powerful open-source relational database, is widely used for its robustness and flexibility. Whether you're managing databases, querying data, or handling user permissions, mastering its core commands is essential. This article outlines the most frequently used PostgreSQL commands, grouped by function, with practical examples to help you get started. These commands are executed via the `psql` command-line interface or GUI tools like pgAdmin.

## Database Management

### 1. Create Database
Creates a new database.
- **Syntax**: `CREATE DATABASE dbname;`
- **Example**:
  ```sql
  CREATE DATABASE company;
  ```
  - Creates a database named `company`.

### 2. Drop Database
Deletes a database and its contents.
- **Syntax**: `DROP DATABASE dbname;`
- **Example**:
  ```sql
  DROP DATABASE company;
  ```
  - Removes the `company` database (use with caution).

### 3. Connect to Database
Switches to a specific database in `psql`.
- **Syntax**: `\c dbname`
- **Example**:
  ```sql
  \c company
  ```
  - Connects to the `company` database.

## Table Management

### 4. Create Table
Defines a new table with columns and constraints.
- **Syntax**:
  ```sql
  CREATE TABLE tablename (
      column1 datatype CONSTRAINT,
      column2 datatype
  );
  ```
- **Example**:
  ```sql
  CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      salary NUMERIC(10, 2),
      hire_date DATE
  );
  ```
  - Creates an `employees` table with an auto-incrementing `id`, required `name`, `salary`, and `hire_date`.

### 5. Drop Table
Deletes a table and its data.
- **Syntax**: `DROP TABLE tablename;`
- **Example**:
  ```sql
  DROP TABLE employees;
  ```
  - Removes the `employees` table.

### 6. Alter Table
Modifies a table’s structure.
- **Syntax**: `ALTER TABLE tablename ADD column_name datatype;`
- **Example**:
  ```sql
  ALTER TABLE employees ADD department VARCHAR(50);
  ```
  - Adds a `department` column to `employees`.

## Data Manipulation

### 7. Insert Data
Adds new rows to a table.
- **Syntax**:
  ```sql
  INSERT INTO tablename (column1, column2) VALUES (value1, value2);
  ```
- **Example**:
  ```sql
  INSERT INTO employees (name, salary, hire_date, department)
  VALUES ('Alice Smith', 75000.00, '2023-01-15', 'Engineering');
  ```
  - Inserts a new employee record.

### 8. Update Data
Modifies existing rows.
- **Syntax**:
  ```sql
  UPDATE tablename SET column1 = value1 WHERE condition;
  ```
- **Example**:
  ```sql
  UPDATE employees SET salary = 80000.00 WHERE name = 'Alice Smith';
  ```
  - Updates Alice’s salary to 80,000.

### 9. Delete Data
Removes rows based on a condition.
- **Syntax**:
  ```sql
  DELETE FROM tablename WHERE condition;
  ```
- **Example**:
  ```sql
  DELETE FROM employees WHERE department = 'Engineering';
  ```
  - Deletes all Engineering department employees.

## Querying Data

### 10. Select Data
Retrieves specific columns.
- **Syntax**:
  ```sql
  SELECT column1, column2 FROM tablename WHERE condition;
  ```
- **Example**:
  ```sql
  SELECT name, salary FROM employees WHERE salary > 70000;
  ```
  - Fetches names and salaries of employees earning over 70,000.

### 11. Select All
Retrieves all columns.
- **Syntax**: `SELECT * FROM tablename;`
- **Example**:
  ```sql
  SELECT * FROM employees;
  ```
  - Returns all data from `employees`.

### 12. Join Tables
Combines data from multiple tables.
- **Syntax**:
  ```sql
  SELECT columns FROM table1 JOIN table2 ON table1.column = table2.column;
  ```
- **Example**:
  ```sql
  CREATE TABLE departments (
      dept_id SERIAL PRIMARY KEY,
      dept_name VARCHAR(50)
  );
  INSERT INTO departments (dept_name) VALUES ('Engineering');
  SELECT e.name, d.dept_name
  FROM employees e
  JOIN departments d ON e.department = d.dept_name;
  ```
  - Shows employee names and their department names.

### 13. Group By
Groups rows for aggregation.
- **Syntax**:
  ```sql
  SELECT column1, aggregate_function(column2)
  FROM tablename
  GROUP BY column1;
  ```
- **Example**:
  ```sql
  SELECT department, AVG(salary) as avg_salary
  FROM employees
  GROUP BY department;
  ```
  - Calculates the average salary per department.

## Indexing

### 14. Create Index
Improves query performance.
- **Syntax**: `CREATE INDEX index_name ON tablename (column_name);`
- **Example**:
  ```sql
  CREATE INDEX idx_employee_name ON employees (name);
  ```
  - Indexes the `name` column for faster searches.

### 15. Drop Index
Removes an index.
- **Syntax**: `DROP INDEX index_name;`
- **Example**:
  ```sql
  DROP INDEX idx_employee_name;
  ```
  - Deletes the `name` index.

## User and Permission Management

### 16. Create User
Creates a new database user.
- **Syntax**: `CREATE USER username WITH PASSWORD 'password';`
- **Example**:
  ```sql
  CREATE USER analyst WITH PASSWORD 'securepass123';
  ```
  - Creates a user named `analyst`.

### 17. Grant Privileges
Assigns permissions to a user.
- **Syntax**: `GRANT privilege_name ON tablename TO username;`
- **Example**:
  ```sql
  GRANT SELECT, INSERT ON employees TO analyst;
  ```
  - Allows `analyst` to read and insert into `employees`.

### 18. Revoke Privileges
Removes user permissions.
- **Syntax**: `REVOKE privilege_name ON tablename FROM username;`
- **Example**:
  ```sql
  REVOKE INSERT ON employees FROM analyst;
  ```
  - Removes `analyst`’s insert permission.

## Utility Commands (psql)

### 19. List Databases
Shows all databases.
- **Syntax**: `\l`
- **Example**:
  ```sql
  \l
  ```
  - Lists databases like `company` and `postgres`.

### 20. List Tables
Lists tables in the current database.
- **Syntax**: `\dt`
- **Example**:
  ```sql
  \dt
  ```
  - Shows tables like `employees` and `departments`.

### 21. Describe Table
Displays a table’s structure.
- **Syntax**: `\d tablename`
- **Example**:
  ```sql
  \d employees
  ```
  - Shows columns, types, and constraints of `employees`.

### 22. Execute SQL File
Runs commands from a `.sql` file.
- **Syntax**: `\i filename.sql`
- **Example**:
  ```sql
  \i setup.sql
  ```
  - Executes `setup.sql` to create tables or insert data.

### 23. Quit psql
Exits the `psql` interface.
- **Syntax**: `\q`
- **Example**:
  ```sql
  \q
  ```
  - Closes the `psql` session.

## Transaction Control

### 24. Begin Transaction
Starts a transaction block.
- **Syntax**: `BEGIN;`
- **Example**:
  ```sql
  BEGIN;
  INSERT INTO employees (name, salary) VALUES ('Bob Jones', 65000.00);
  ```
  - Starts a transaction for inserting a row.

### 25. Commit Transaction
Saves transaction changes.
- **Syntax**: `COMMIT;`
- **Example**:
  ```sql
  COMMIT;
  ```
  - Permanently saves the new employee.

### 26. Rollback Transaction
Discards transaction changes.
- **Syntax**: `ROLLBACK;`
- **Example**:
  ```sql
  BEGIN;
  INSERT INTO employees (name, salary) VALUES ('Eve Black', 70000.00);
  ROLLBACK;
  ```
  - Discards the insertion.

## Aggregate Functions

### 27. Count
Counts rows.
- **Syntax**: `SELECT COUNT(*) FROM tablename;`
- **Example**:
  ```sql
  SELECT COUNT(*) FROM employees WHERE department = 'Engineering';
  ```
  - Counts Engineering employees.

### 28. Sum
Calculates a column’s total.
- **Syntax**: `SELECT SUM(column) FROM tablename;`
- **Example**:
  ```sql
  SELECT SUM(salary) FROM employees;
  ```
  - Sums all salaries.

### 29. Average
Computes a column’s average.
- **Syntax**: `SELECT AVG(column) FROM tablename;`
- **Example**:
  ```sql
  SELECT AVG(salary) FROM employees WHERE department = 'Engineering';
  ```
  - Averages Engineering salaries.

## Conclusion

These 29 PostgreSQL commands cover the essentials for managing databases, tables, data, and users. From creating and querying tables to handling transactions and permissions, they form the backbone of most PostgreSQL workflows. Commands like `SELECT`, `INSERT`, and `GROUP BY` are daily staples for developers, while `psql` utilities like `\dt` and `\l` streamline administration. For advanced features like triggers or window functions, consult PostgreSQL’s documentation or experiment with these basics first. Start practicing in a test environment to build confidence!