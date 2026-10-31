# Banana Brain – Authentication and Virtual Identity

## 1. Introduction

Virtual identity represents a user's digital identity within an application. Banana Brain uses an authentication system to identify users and control access to protected resources.

## 2. User Authentication

The application supports user registration and login. During registration, passwords are hashed using bcrypt before being stored in the database. During login, the submitted password is compared with the stored password hash.

## 3. Session Management

Banana Brain uses Express Session to manage authenticated user sessions. After successful login, the server creates a session containing the user's ID and role.

The session is stored in PostgreSQL using connect-pg-simple.

## 4. Cookie Management

The application uses an HTTP-only session cookie named `bb.sid`. The cookie allows the browser to maintain the user's authenticated session.

Security settings include:
- HTTP-only cookies to prevent JavaScript access.
- Secure cookies in production.
- SameSite set to Lax.
- A configured session expiration time.

## 5. Access Control

Authentication middleware checks whether a valid user session exists before allowing access to protected routes. Administrator middleware additionally checks the user's role.

## 6. Security Measures

The application uses bcrypt password hashing, session regeneration after authentication, login rate limiting and protected routes to improve account security.

## 7. Critical Evaluation

Session-based authentication provides centralized session management and allows the server to control authentication state. However, it requires session storage and careful cookie configuration.

An alternative approach would be token-based authentication using JWT. However, the current application uses server-side sessions, which provide control over session invalidation.

## 8. Conclusion

Banana Brain establishes virtual identity through user accounts, password verification, server-side sessions and access control mechanisms.