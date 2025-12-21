# Docker 101

This guide covers the Docker basics you need to work with the Arnett dashboard. If you get stuck, this is your reference.

## Containers vs VMs: A Simple Analogy

Think of your computer as an apartment building:

- **Virtual Machines (VMs)** are like separate apartments, each with their own kitchen, bathroom, and utilities. Each VM needs a full operating system, which is heavy and slow to start.

- **Containers** are like people sharing the same building infrastructure (plumbing, electricity) but having their own private rooms. They share the host OS kernel but keep their apps isolated. This makes them lightweight and fast.

For the dashboard, Docker containers let everyone run the exact same environment without installing Python, Node, Postgres, Redis, etc. directly on their machine.

## Why Docker Exists

**The Problem:** "It works on my machine" syndrome.

You might have Python 3.11, your teammate has 3.9, and the server has 3.10. Different versions lead to different bugs. Docker solves this by packaging everything the app needs into a container that runs the same way everywhere.

**For this project:** The `docker-compose.yml` file defines exactly which versions of what services to run. When you `docker compose up`, everyone gets the same setup.

## Key Commands

### `docker compose up`

Starts all services defined in `docker-compose.yml`.

```bash
docker compose up
```

Add `-d` to run in "detached mode" (background):

```bash
docker compose up -d
```

This builds images if needed, creates containers, and starts them. You'll see logs from all services.

### `docker compose down`

Stops and removes all containers created by `docker compose up`.

```bash
docker compose down
```

This doesn't delete your data volumes by default, so your database persists.

### `docker ps`

Lists running containers.

```bash
docker ps
```

Shows container ID, image name, status, and ports. Useful for checking what's actually running.

### `docker logs`

Shows logs from a specific container.

```bash
docker logs <container-name>
```

Or follow logs in real-time:

```bash
docker logs -f <container-name>
```

Replace `<container-name>` with the actual container name from `docker ps`.

### `docker compose logs`

Shows logs from all services, or a specific one:

```bash
docker compose logs
docker compose logs backend
docker compose logs -f frontend
```

## docker-compose.yml Breakdown

The `docker-compose.yml` file is the blueprint for your multi-container application.

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/dbname
    depends_on:
      - db
      - redis
```

### Services

Each top-level key under `services:` is a container. Common ones in this project:

- `backend` - FastAPI Python server
- `frontend` - React development server
- `db` - Postgres database
- `redis` - Redis cache/session store

### Ports

```yaml
ports:
  - "8000:8000"
```

Maps `host:container` ports. The left side (8000) is your laptop's port, the right side (8000) is the container's port. This lets you access `localhost:8000` in your browser and reach the container.

### Volumes

```yaml
volumes:
  - ./backend:/app
```

Mounts your local `./backend` folder into the container at `/app`. This means code changes on your laptop instantly appear in the container - no rebuild needed.

### Environment

```yaml
environment:
  - DATABASE_URL=postgresql://user:pass@db:5432/dbname
```

Sets environment variables inside the container. Often used for config like database URLs, API keys, etc.

Note: `db` in the URL refers to the service name in docker-compose, not "localhost". Docker creates a network where services can talk to each other by name.

### depends_on

```yaml
depends_on:
  - db
  - redis
```

Tells Docker to start `db` and `redis` before `backend`. Doesn't wait for them to be "ready", just started.

## Troubleshooting Common Issues

### Port Already in Use

**Error:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution:** Something else is using that port. Either stop that process or change the port mapping in docker-compose.yml:

```yaml
ports:
  - "8001:8000"  # Use 8001 on your host instead
```

### Container Keeps Restarting

**Check logs:**

```bash
docker compose logs backend
```

Common causes:
- Missing environment variables
- Database not ready yet (backend trying to connect too early)
- Syntax error in code

### Changes Not Appearing

**Volume issue:** Make sure your `docker-compose.yml` has the volume mount:

```yaml
volumes:
  - ./backend:/app
```

**Cached build:** Sometimes you need to rebuild:

```bash
docker compose down
docker compose up --build
```

### Database Connection Failed

**Error:** `could not connect to server: Connection refused`

**Solution:**
1. Make sure `db` service is running: `docker ps`
2. Check `depends_on` in docker-compose.yml
3. Verify `DATABASE_URL` uses the service name (e.g., `db:5432`, not `localhost:5432`)

### Can't Access Localhost

**Check port mappings:** `docker ps` shows which ports are mapped.

**Check the service is running:** `docker compose logs <service-name>`

**Firewall:** On some systems, Docker needs firewall permissions.

### Starting Fresh

If things are really broken, nuke everything and start over:

```bash
docker compose down -v  # -v removes volumes too
docker compose up --build
```

Warning: `-v` deletes database data. Only use if you're okay losing local data.

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `docker compose up` | Start all services |
| `docker compose up -d` | Start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose logs` | View all logs |
| `docker compose logs -f backend` | Follow backend logs |
| `docker ps` | List running containers |
| `docker compose build` | Rebuild images |
| `docker compose up --build` | Rebuild and start |

## Going Deeper

This covers what you need for the project. For more:

- [Official Docker docs](https://docs.docker.com/)
- [Docker Compose docs](https://docs.docker.com/compose/)
- [Docker tutorial for beginners](https://docker-curriculum.com/)

Remember: Docker is a tool to make your life easier. If it's making things harder, ask for help.
