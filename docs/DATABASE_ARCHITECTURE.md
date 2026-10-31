# Banana Brain – Database Architecture

## 1. Introduction

Banana Brain uses PostgreSQL as its relational database management system. It provides persistent storage for application data.

## 2. Database Connection

The backend uses the Node.js `pg` library to communicate with PostgreSQL. A connection pool manages database connections and supports efficient query execution.

## 3. Database Organization

The backend separates database operations into repository modules. These repositories handle data access independently from the application controllers.

## 4. Query Management

The application uses parameterized SQL queries to interact with the database. This helps reduce SQL injection risks.

## 5. Database Migrations

Database migration files are used to manage database schema changes and maintain a consistent database structure.

## 6. Benefits

PostgreSQL provides structured data storage, relational integrity and reliable database operations. Separating database access from business logic also improves maintainability.

## 7. Conclusion

The database architecture supports the application's backend by providing organized, persistent and structured data management.