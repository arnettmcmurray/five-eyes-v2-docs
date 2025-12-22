# Five Eyes LTD - Setup & Running Guide

## Prerequisites (One-Time Install)

### Install Required Software

**Mac OS:**

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (v18+)
brew install node@18

# Install Python (v3.10+)
brew install python@3.10

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop
```

**Windows:**

1. Download Node.js: https://nodejs.org/ (v18+)
2. Download Python: https://www.python.org/downloads/ (v3.10+)
3. Download Docker Desktop: https://www.docker.com/products/docker-desktop

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install nodejs npm python3 python3-venv
# Docker: https://docs.docker.com/engine/install/
```

---

## Clone & Setup

```bash
# Clone the repository
git clone https://github.com/arnettmcmurray/123.git
cd Five-Eyes-LTD-Cyber-Hygiene-App

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies (frontend)
cd frontend
npm install
cd ..
```

---

## Running the Application

### Terminal 1: Backend (Docker)

```bash
# From project root: ~/[your-path]/Five-Eyes-LTD-Cyber-Hygiene-App
docker-compose -f compose/docker-compose.yml up
```

Wait for all services to start green (PostgreSQL, Redis, backend).

### Terminal 2: Frontend

```bash
# From project root: ~/[your-path]/Five-Eyes-LTD-Cyber-Hygiene-App
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

### Terminal 3: Verify Backend Health (Optional)

```bash
# Test backend is responding
curl http://localhost:5000/health
```

Expected response: `{"status":"ok"}`

---

## Accessing the App

Open browser and go to:

```
http://localhost:5173
```

You should see the Five Eyes dashboard.

---

## Testing the Chatbot

1. Log in (or create account)
2. Navigate to training module
3. Look for chat button (corner of screen)
4. Click and ask a question
5. AI chatbot should respond with training content

---

## Stopping Everything

**Terminal 1 (Backend):** Press `Ctrl+C`
**Terminal 2 (Frontend):** Press `Ctrl+C`

Clean shutdown:

```bash
docker-compose -f compose/docker-compose.yml down
```

---

## Troubleshooting

**Port already in use:**

```bash
# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill Docker containers
docker-compose -f compose/docker-compose.yml down
```

**Module not found errors:**

```bash
# Frontend
cd frontend
npm install

# Backend (in venv)
pip install -r requirements.txt
```

**Docker won't start:**

1. Make sure Docker Desktop is running
2. Run: `docker ps`
3. If error, restart Docker Desktop

---

## Key Folders

- **Frontend code:** `./frontend/src/`
- **Backend code:** `./app/`
- **Docker config:** `./compose/`
- **Database:** PostgreSQL (running in Docker)
- **Cache:** Redis (running in Docker)

---

## Environment Variables

Create `.env` file in project root with:

```
OPENAI_API_KEY=your-key-here
DATABASE_URL=postgresql://user:password@db:5432/fiveeyes
REDIS_URL=redis://redis:6379
```

Ask Arnett for the actual keys.

---

## Quick Commands Reference

```bash
# Full startup
docker-compose -f compose/docker-compose.yml up &
cd frontend && npm run dev

# Check backend
curl http://localhost:5000/health

# Check frontend
http://localhost:5173

# Shutdown all
docker-compose -f compose/docker-compose.yml down
```

---

Done. App is running. Move on to testing or development.
