# Node Auth JWT example

Curso Midu:
<https://www.youtube.com/watch?v=UqnnhAZxRac>

## Getting Started

```bash
nvm use 22
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with postman.

## Technologies

This project uses the following technologies:

- **express**: Web application framework for Node.js
- **express-session**: Session middleware for Express.js
- **db-local**: Lightweight local database for development
- **jsonwebtoken**: For generating and verifying JSON Web Tokens (JWT)
- **bcrypt**: For hashing and comparing passwords securely
- **zod**: TypeScript-first schema validation with static type inference
- **cookie-parser**: For parsing cookies in Express.js
- **ejs**: Templating engine for generating HTML markup with JavaScript
- **connect-flash**: For flash messages in Express.js

## Endpoints

### Register

```bash
curl --location 'http://localhost:3000/api/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Lisandro",
    "password": "your-password"
}'
```

### Login

```bash
curl --location 'http://localhost:3000/api/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Lisandro",
    "password": "your-password"
}'
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -H "Cookie: refresh_token=your-refresh-token"
```
