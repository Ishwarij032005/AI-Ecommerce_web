# AI-Enabled E-Commerce (MERN) — Complete Project

## Quick start (local)

1. Backend
cd backend
npm install
cp .env.example .env

edit .env: set MONGODB_URI (or leave default local), JWT_SECRET, ADMIN_TOKEN, OPENAI_API_KEY
npm run seed
npm run start

nginx
Copy code
Backend will run on http://localhost:5000

2. Frontend
cd frontend
npm install

optional: set VITE_API_URL in .env, default is http://localhost:5000/api
npm run dev

cpp
Copy code
Frontend runs at http://localhost:3000

3. Docker (optional)
docker-compose up --build

sql
Copy code

## Default seed credentials
- Admin: admin@demo.com / adminpass
- Users: alice@demo.com / userpass, bob@demo.com / userpass

## Notes
- Put your OpenAI API key in backend/.env as OPENAI_API_KEY=sk-...
- Admin routes accept either:
- x-admin-token header (matches ADMIN_TOKEN), or
- an authenticated user with isAdmin=true (JWT)

## Features
- JWT Authentication
- OpenAI chatbot
- Collaborative filtering recommendations using order history
- File uploads using Multer
- Admin Dashboard (create/edit/delete products)