# Shortly – URL Shortener Service

Shortly is a **full-stack, production-ready URL shortener** inspired by Bitly.  
It allows users to shorten long URLs, optionally set custom aliases, define expiration dates, and quickly redirect through a high-performance caching layer.

---

## 📌 Features

- **Shorten URLs** with automatic Base62-encoded IDs or custom aliases
- **Optional expiration date** for links
- **Fast redirects** with Redis caching
- **Collision-safe** short code generation using Snowflake IDs
- **Fully validated input** with alias restrictions
- **RESTful API** built in **Spring Boot 3**
- **Responsive frontend** built in **React + Vite + TailwindCSS**
- **PostgreSQL** as primary datastore
- **Redis** as caching layer

---

## 🛠 Tech Stack

**Backend**
- Java 21, Spring Boot 3
- Spring Data JPA (PostgreSQL)
- Spring Data Redis
- Maven

**Frontend**
- React 18 + Vite
- TailwindCSS
- Axios

**Infrastructure**
- PostgreSQL (local, Neon, or RDS)
- Redis (local, Upstash, or ElastiCache)
- Docker for containerized deployment
- Render / Vercel / Netlify for hosting

---

## 📂 Project Structure

```
shortly/
├── backend/           # Spring Boot backend
│   ├── src/main/java  # Java source
│   ├── src/main/resources
│   ├── pom.xml
│   └── Dockerfile
└── frontend/          # React + Vite frontend
    ├── src/
    ├── public/
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/Ashmitgarg18/shortly.git
cd shortly
```

---

### 2. Backend Setup

**Environment Variables** (`backend/.env` or your host’s env config):
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<db>?sslmode=require
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>

SPRING_REDIS_URL=redis://default:<password>@<host>:<port>

APP_BASE_DOMAIN=http://localhost:8080/api/
APP_CACHE_DEFAULT_TTL_SECONDS=604800
```

**Run Locally (Maven)**
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at: `http://localhost:8080`

---

### 3. Frontend Setup

**Environment Variables** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Run Locally**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 📦 Docker Deployment

**Build & Run**
```bash
docker build -t shortly-backend ./backend
docker run -p 8080:8080 --env-file backend/.env shortly-backend
```

**Multi-container (Backend + Postgres + Redis)**
```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: shortly
      POSTGRES_PASSWORD: shortly
      POSTGRES_DB: shortly
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/shortly
      SPRING_DATASOURCE_USERNAME: shortly
      SPRING_DATASOURCE_PASSWORD: shortly
      SPRING_REDIS_HOST: redis
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
```

---

## ☁️ Deployment

### Render
1. Deploy **Postgres** and **Redis** as managed services.
2. Deploy backend as **Docker Web Service**.
3. Deploy frontend as **Static Site**.
4. Set env vars for both in Render dashboard.

### Vercel / Netlify (Frontend)
- Build command: `npm run build`
- Output directory: `dist`
- Env var: `VITE_API_BASE_URL=https://<your-backend>.onrender.com/api`

---

## 📈 Scaling Notes

- Stateless API → horizontally scalable with load balancer
- Redis cache for high hit rate → reduced DB load
- Proper DB indexing (`short_code` unique)
- Optional rate limiting per IP
- CDN/Edge caching for redirects

---

## 🔒 Security

- CORS restricted to frontend origin
- URL + alias validation
- Optional domain allow/block list
- Rate limiting (future)

---
