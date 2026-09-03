Backend — Express API (MERN scaffold)

Prereqs

- Node.js >= 16
- npm
- MongoDB (local or Atlas)

Setup

1. cd backend
2. npm install
3. copy `.env.example` to `.env` and set `MONGODB_URI` if needed
4. npm run dev (requires `nodemon`) or `npm start`

Routes

- GET `/api/health` — returns `{ status: 'ok' }`
- POST `/api/auth/register` — register a user (name, email, password)
- GET `/api/users` — list users (password omitted)

Notes

This is a scaffolded backend intended to be expanded into a full final project. Add authentication, validation, and security measures before production use.
