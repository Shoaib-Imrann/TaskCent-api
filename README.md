# TaskCent API

Node.js/Express backend for TaskCent task management system.

## Tech Stack

**Runtime:** Node.js  
**Framework:** Express  
**Database:** PostgreSQL with Sequelize ORM  
**Auth:** JWT with bcryptjs

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   Create `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/taskcent
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:3000
   PORT=8000
   ```

3. **Start server:**
   ```bash
   pnpm run dev
   ```

Server runs on http://localhost:8000

## API Endpoints

**Auth:**
- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/profile` - Get profile

**Tasks:**
- GET `/api/tasks` - List tasks
- GET `/api/tasks/stats` - Statistics
- POST `/api/tasks` - Create task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task