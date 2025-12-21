# Troubleshooting Guide

Common problems and their solutions, organized by symptom.

## Port Conflicts

### Problem: Port 5173 already in use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use :::5173
```

**What this means:** Something else is already using port 5173 (the frontend port).

**Solutions:**

1. **Find what's using the port:**
   ```bash
   # On Mac/Linux
   lsof -i :5173

   # On Windows
   netstat -ano | findstr :5173
   ```

2. **Stop the other process:**
   - If it's another instance of this app, stop it with `docker compose down`
   - If it's a different app, close it or kill the process

3. **Or change the port:**
   - Edit `docker-compose.yml`
   - Change `"5173:5173"` to `"5174:5173"` (or any other available port)
   - Access the app at `localhost:5174` instead

### Problem: Port 8000 already in use

**Symptom:**
```
Error: bind: address already in use
```

**What this means:** Something else is using port 8000 (the backend port).

**Solutions:**

1. **Find and stop the process** (same as above, but for port 8000)

2. **Or change the backend port:**
   - Edit `docker-compose.yml`
   - Change `"8000:8000"` to `"8001:8000"`
   - Update `VITE_API_URL` in `frontend/.env` to `http://localhost:8001`

### Problem: Port 5432 already in use

**Symptom:**
```
Error: port is already allocated
```

**What this means:** You probably have PostgreSQL installed locally and it's using port 5432.

**Solutions:**

1. **Stop local PostgreSQL:**
   ```bash
   # On Mac
   brew services stop postgresql

   # On Windows
   # Stop PostgreSQL service in Services app

   # On Linux
   sudo systemctl stop postgresql
   ```

2. **Or change the database port:**
   - Edit `docker-compose.yml`
   - Change `"5432:5432"` to `"5433:5432"`
   - Update `DATABASE_URL` in `backend/.env` to use port 5433

## Docker Issues

### Problem: Cannot connect to Docker daemon

**Symptom:**
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```

**What this means:** Docker Desktop isn't running.

**Solutions:**

1. **Start Docker Desktop:**
   - Open Docker Desktop application
   - Wait for it to fully start (whale icon in menu bar/system tray)
   - Try your command again

2. **If Docker Desktop won't start:**
   - Restart your computer
   - Check if virtualization is enabled in BIOS (Windows/Linux)
   - Reinstall Docker Desktop if necessary

### Problem: Docker commands are slow

**Symptom:** Everything works but takes forever.

**Solutions:**

1. **Give Docker more resources:**
   - Open Docker Desktop
   - Go to Settings > Resources
   - Increase CPU and Memory allocation
   - Click "Apply & Restart"

2. **Clean up unused resources:**
   ```bash
   docker system prune -a
   ```
   Warning: This removes all stopped containers and unused images.

3. **Reset Docker Desktop:**
   - Settings > Troubleshoot > Reset to factory defaults
   - This is a last resort - you'll need to rebuild everything

### Problem: No space left on device

**Symptom:**
```
Error: no space left on device
```

**What this means:** Docker has filled up your disk with images, containers, and volumes.

**Solutions:**

1. **Remove unused Docker resources:**
   ```bash
   docker system prune -a -f
   ```

2. **Remove specific things:**
   ```bash
   # Remove old containers
   docker container prune

   # Remove old images
   docker image prune -a

   # Remove unused volumes
   docker volume prune
   ```

3. **Check what's using space:**
   ```bash
   docker system df
   ```

## Environment Issues

### Problem: Missing .env file

**Symptom:**
```
Error: DATABASE_URL environment variable not set
```

**What this means:** The backend needs a `.env` file with configuration.

**Solutions:**

1. **Create the .env file:**
   ```bash
   # In backend directory
   touch backend/.env
   ```

2. **Add required variables:**
   ```
   DATABASE_URL=postgresql://arnett_user:arnett_pass@db:5432/arnett
   SECRET_KEY=your-secret-key-here
   ```

3. **Check if .env.example exists:**
   - Copy it: `cp backend/.env.example backend/.env`
   - Fill in any missing values

### Problem: Environment variables not updating

**Symptom:** Changed .env file but app still uses old values.

**Solutions:**

1. **Restart the containers:**
   ```bash
   docker compose down
   docker compose up
   ```

2. **Rebuild if that doesn't work:**
   ```bash
   docker compose down
   docker compose up --build
   ```

## Windows/WSL Issues

### Problem: Line ending errors

**Symptom:**
```
/bin/sh: bad interpreter: No such file or directory
```

**What this means:** Windows uses different line endings (CRLF) than Linux (LF).

**Solutions:**

1. **Configure git to use LF:**
   ```bash
   git config --global core.autocrlf input
   ```

2. **Re-clone the repository:**
   ```bash
   # Delete current repo
   # Clone again with new settings
   ```

3. **Or convert existing files:**
   ```bash
   # In repository root
   find . -type f -exec dos2unix {} \;
   ```

### Problem: Slow file performance on WSL

**Symptom:** App works but file changes take forever to reflect.

**Solutions:**

1. **Move project to WSL filesystem:**
   - Don't work in `/mnt/c/`
   - Clone to `~/projects/` instead
   - Much faster file I/O

2. **Use WSL 2:**
   - Check version: `wsl -l -v`
   - Upgrade if needed: `wsl --set-version Ubuntu 2`

## Container Issues

### Problem: Container won't start

**Symptom:**
```
Container arnett-backend exited with code 1
```

**Solutions:**

1. **Check the logs:**
   ```bash
   docker logs arnett-backend
   ```
   The error message usually tells you what's wrong.

2. **Common causes:**
   - Missing environment variables
   - Syntax error in code
   - Missing dependencies
   - Database connection failed

3. **Try rebuilding:**
   ```bash
   docker compose up --build
   ```

### Problem: Container keeps restarting

**Symptom:** Container starts, crashes, restarts, crashes again.

**Solutions:**

1. **Check the logs:**
   ```bash
   docker compose logs backend
   ```
   Look for the error right before it crashes.

2. **Common causes:**
   - Application crashes on startup
   - Database isn't ready yet (add depends_on in docker-compose.yml)
   - Port conflict
   - Missing files

3. **Stop the restart loop:**
   ```bash
   docker compose down
   # Fix the issue
   docker compose up
   ```

## Access Issues

### Problem: Can't access localhost:5173

**Symptom:** Browser says "This site can't be reached" or "Connection refused"

**Solutions:**

1. **Check if container is running:**
   ```bash
   docker ps
   ```
   Should see arnett-frontend in the list.

2. **Check the logs:**
   ```bash
   docker logs arnett-frontend
   ```
   Look for "ready" or "listening" message.

3. **Try different browsers:**
   - Chrome, Firefox, Safari, Edge
   - Sometimes one browser has issues

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

5. **Check if port mapping is correct:**
   ```bash
   docker ps
   ```
   Look at PORTS column - should show `0.0.0.0:5173->5173/tcp`

### Problem: API calls failing (404 or CORS errors)

**Symptom:** Frontend loads but can't fetch data from backend.

**Solutions:**

1. **Check backend is running:**
   ```bash
   docker ps | grep backend
   ```

2. **Verify API URL:**
   - Check `frontend/.env`
   - Should be `VITE_API_URL=http://localhost:8000`

3. **Test backend directly:**
   - Visit `http://localhost:8000/docs` in browser
   - Should see API documentation

4. **Check CORS settings:**
   - Look at `backend/app/main.py`
   - Make sure localhost:5173 is allowed

## "It Worked Yesterday" Scenarios

### Problem: It worked yesterday, now nothing works

**Symptom:** You didn't change anything but now it's broken.

**Solutions:**

1. **Did you restart your computer?**
   - Docker Desktop might not have started
   - Check if Docker Desktop is running

2. **Did someone else push changes?**
   ```bash
   git pull
   docker compose up --build
   ```

3. **Did Docker update?**
   - Docker Desktop auto-updates sometimes
   - Check version: `docker --version`
   - Restart Docker Desktop

4. **Nuclear option - start fresh:**
   ```bash
   docker compose down -v
   docker system prune -a -f
   docker compose up --build
   ```

### Problem: Changes not showing up

**Symptom:** Edited code but app looks the same.

**Solutions:**

1. **Did you save the file?**
   - Check for unsaved indicator in editor

2. **Check file is in the right place:**
   - Make sure you edited the file that's mounted in the container
   - Check volumes in docker-compose.yml

3. **Hard refresh browser:**
   - Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open in incognito/private mode

4. **Check if auto-reload is working:**
   - Look at container logs
   - Should see "Recompiling..." or "Restarting..." messages

5. **Restart container:**
   ```bash
   docker compose restart frontend
   ```

## Database Issues

### Problem: Database connection failed

**Symptom:**
```
Error: could not connect to server
```

**Solutions:**

1. **Check if database container is running:**
   ```bash
   docker ps | grep postgres
   ```

2. **Check DATABASE_URL:**
   - Should be in `backend/.env`
   - Format: `postgresql://user:password@db:5432/arnett`
   - Note: Use `db` not `localhost` for hostname (container name)

3. **Wait for database to be ready:**
   - Database takes a few seconds to start
   - Backend might try to connect before it's ready
   - Restart backend: `docker compose restart backend`

### Problem: Old data still showing

**Symptom:** Changed data in JSON files but still see old data.

**Solutions:**

1. **Restart backend:**
   ```bash
   docker compose restart backend
   ```

2. **Database might need reset:**
   ```bash
   docker compose down -v
   docker compose up
   ```
   Warning: This deletes all data, including user accounts.

## Installation Issues

### Problem: Docker Desktop won't install

**Symptom:** Installation fails or Docker Desktop won't open.

**Solutions:**

1. **Check system requirements:**
   - Windows: Need Windows 10 Pro/Enterprise or Windows 11
   - Mac: Need macOS 10.15 or newer
   - Linux: Varies by distribution

2. **Enable virtualization:**
   - Windows: Enable Hyper-V and WSL 2
   - Mac: Usually enabled by default
   - Check BIOS settings

3. **Try Docker Engine instead:**
   - Linux: Install Docker Engine directly
   - Lighter weight than Docker Desktop

### Problem: Git clone fails

**Symptom:**
```
Permission denied (publickey)
```

**Solutions:**

1. **Use HTTPS instead of SSH:**
   ```bash
   git clone https://github.com/yourorg/arnett-dashboard.git
   ```

2. **Or set up SSH key:**
   - Generate key: `ssh-keygen -t ed25519`
   - Add to GitHub: Settings > SSH Keys
   - Try clone again

## Getting Help

If none of these solutions work:

1. **Gather information:**
   - What command did you run?
   - What was the exact error message?
   - What does `docker ps` show?
   - What do the logs show?

2. **Check resources:**
   - README.md in the repository
   - Docker documentation
   - Stack Overflow

3. **Ask your team:**
   - Share the error message
   - Share relevant logs
   - Describe what you tried

4. **Create an issue:**
   - If it's a bug in the dashboard itself
   - Include steps to reproduce
   - Include error messages and logs

## Prevention

To avoid issues in the future:

1. **Keep Docker Desktop updated**
2. **Don't edit files inside containers**
3. **Use .env.example as a template**
4. **Commit .env to .gitignore**
5. **Run `docker compose down` before shutting down**
6. **Pull latest changes before starting work**
7. **Restart containers after pulling changes**
8. **Check logs when things seem off**

## Quick Reference

Common commands for troubleshooting:

```bash
# See what's running
docker ps

# See logs
docker compose logs
docker compose logs -f  # follow mode

# Restart everything
docker compose restart

# Stop everything
docker compose down

# Complete reset
docker compose down -v
docker compose up --build

# Clean up Docker
docker system prune -a

# Check Docker info
docker info
docker version

# Check ports
# Mac/Linux
lsof -i :5173
lsof -i :8000
lsof -i :5432

# Windows
netstat -ano | findstr :5173
```
