# Docker Explained (For Beginners)

This guide explains Docker in plain English for people who have never used it before.

## What is Docker?

Docker is a tool that packages your application and everything it needs to run into "containers."

**Think of it like this:** Instead of saying "it works on my machine" and having everyone install Python, PostgreSQL, Node.js, and a million dependencies, Docker gives everyone the exact same working environment in a box.

### Containers vs. Virtual Machines

- **Virtual Machine (VM):** Like running a whole other computer inside your computer. Heavy and slow.
- **Container:** Like running an app in its own isolated space. Lightweight and fast.

Containers share your computer's operating system but keep everything else separate. That's why they start up in seconds instead of minutes.

## Why Docker Matters for This Project

Everyone on your team has a different setup:
- Different operating systems (Mac, Windows, Linux)
- Different versions of tools installed
- Different configurations

With Docker, everyone runs the exact same environment. If it works on your machine, it works on everyone's machine.

## Key Commands You Need to Know

### Starting the Application

```bash
docker compose up
```

This reads the `docker-compose.yml` file and starts all the services (frontend, backend, database).

**What's happening behind the scenes:**
1. Docker downloads images (pre-built environments) if you don't have them
2. Creates containers from those images
3. Starts all the services defined in docker-compose.yml
4. Connects them together so they can talk to each other

### Stopping the Application

Press `Ctrl+C` in the terminal where docker compose is running.

Or run:

```bash
docker compose down
```

### Seeing What's Running

```bash
docker ps
```

This shows all running containers. You should see:
- Frontend container (React app)
- Backend container (FastAPI server)
- Database container (PostgreSQL)

### Checking Logs

If something isn't working, check the logs:

```bash
docker logs <container-name>
```

Or to see logs from all services:

```bash
docker compose logs
```

To follow logs in real-time:

```bash
docker compose logs -f
```

### Starting Fresh

If things get weird and you want to completely reset:

```bash
docker compose down -v
docker compose up
```

The `-v` flag removes volumes (stored data), giving you a completely clean slate.

## Reading docker-compose.yml

The `docker-compose.yml` file is like a recipe that tells Docker what to run.

Here's what the key parts mean:

### Services

```yaml
services:
  frontend:
    # Configuration for the React app
  backend:
    # Configuration for the FastAPI server
  db:
    # Configuration for the PostgreSQL database
```

Each service is a separate container. They run independently but can communicate with each other.

### Ports

```yaml
ports:
  - "5173:5173"
```

This maps ports between your computer and the container:
- First number (5173): Port on your computer
- Second number (5173): Port inside the container

So when you go to `localhost:5173`, Docker forwards that to port 5173 inside the container.

### Volumes

```yaml
volumes:
  - ./frontend:/app
```

Volumes connect folders on your computer to folders inside the container:
- `./frontend`: Folder on your computer
- `/app`: Folder inside the container

This means when you edit code on your computer, the changes immediately appear inside the container.

### Environment Variables

```yaml
environment:
  - DATABASE_URL=postgresql://user:password@db:5432/arnett
```

These set configuration values that the app needs to run. Database credentials, API keys, etc.

## Common Issues and Fixes

### "Port already in use"

**Problem:** You see an error like "port 5173 is already allocated"

**Solution:** Something else is using that port. Either:
1. Stop the other application using that port
2. Or change the port in docker-compose.yml

### "Cannot connect to Docker daemon"

**Problem:** Docker Desktop isn't running

**Solution:** Open Docker Desktop and wait for it to fully start (you'll see the whale icon in your menu bar/system tray)

### "No space left on device"

**Problem:** Docker has filled up your disk with old images and containers

**Solution:** Clean up unused Docker resources:

```bash
docker system prune -a
```

### Changes Not Showing Up

**Problem:** You edited code but the app still looks the same

**Solution:**
1. Make sure you saved the file
2. Check if the container restarted (watch the logs)
3. Try a hard refresh in your browser (Cmd+Shift+R or Ctrl+Shift+R)
4. If still not working, restart the containers: `docker compose restart`

### "Cannot find module" Errors

**Problem:** The app can't find dependencies

**Solution:** You might need to rebuild the containers:

```bash
docker compose down
docker compose up --build
```

The `--build` flag forces Docker to rebuild the images, which reinstalls dependencies.

## Tips for Success

1. **Keep Docker Desktop running** while you're developing
2. **Check the logs** when something isn't working - they usually tell you what's wrong
3. **Don't edit files inside the container** - always edit on your computer and let volumes sync the changes
4. **Be patient** the first time you run docker compose up - it has to download images, which can take a few minutes
5. **When in doubt, restart** - `docker compose restart` fixes a surprising number of issues

## Next Steps

Now that you understand Docker basics, you can:
- Explore the codebase with confidence
- Make changes and see them reflected immediately
- Debug issues using container logs
- Help teammates troubleshoot their Docker setup
