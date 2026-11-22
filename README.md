# SpendWise - Daily Budget Tracker (MERN Stack)

A modern full-stack web application designed for quick, effortless daily budget tracking. Log your daily total spend in seconds, track salary deposits, and get smart daily spending analytics.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite) + Redux Toolkit + Axios + Vanilla CSS (Glassmorphism)
- **Backend**: Node.js + Express.js + Cookie Parser + JWT
- **Database**: MongoDB (Mongoose ODM)

---

## 🚀 How to Host / Deploy (Free Hosting Options)

### Option 1: Render.com (Recommended - Full Stack in 1-Click)
1. Push this project code to GitHub.
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas Connection String
   - `JWT_SECRET`: A secure secret key (e.g. `my_super_secret_key_2026`)
   - `NODE_ENV`: `production`

---

### Option 2: Separate Hosting (Frontend on Vercel/Netlify + Backend on Render/Railway)

#### Backend (Render/Railway/Cyclic):
- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`
- Env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=https://your-frontend.vercel.app`

#### Frontend (Vercel/Netlify):
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies for server and client
npm run build

# 2. Start server & client concurrently
npm start
```
