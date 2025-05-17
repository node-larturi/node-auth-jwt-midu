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

## Endpoints

### Register

```bash
curl --location 'http://localhost:3000/api/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Lea",
    "password": "123456"
}'
```

### Login

```bash
curl --location 'http://localhost:3000/api/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Lea",
    "password": "123456"
}'
```
