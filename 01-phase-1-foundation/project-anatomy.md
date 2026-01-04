# Project Anatomy

This guide maps out the codebase so you know where everything lives.

## High-Level Structure

```
arnett-dashboard/
├── frontend/          # React application (what users see)
├── backend/           # FastAPI server (handles data and logic)
├── docker-compose.yml # Defines how all the pieces run together
└── README.md          # Setup instructions
```

Think of it like a restaurant:
- **Frontend:** The dining room where customers interact
- **Backend:** The kitchen where the work happens
- **Docker Compose:** The building that houses both

## Frontend Organization

```
frontend/
├── src/
│   ├── pages/         # Full page components (Dashboard, Training, FAQ)
│   ├── components/    # Reusable UI pieces (Header, Chatbot, Cards)
│   ├── hooks/         # Custom React hooks (useAuth, useFetch)
│   ├── services/      # API calls to the backend
│   ├── App.jsx        # Main app component and routing
│   └── main.jsx       # Entry point
├── public/            # Static assets (images, icons)
└── package.json       # Dependencies and scripts
```

### Key Frontend Files to Know

**src/App.jsx**
- Sets up routing (which URL shows which page)
- Wraps the app with providers (authentication, theme, etc.)

**src/pages/**
- Each file is a full page in the application
- Examples: Dashboard.jsx, TrainingModules.jsx, FAQ.jsx

**src/components/**
- Reusable pieces used across multiple pages
- Examples: Header.jsx, Chatbot.jsx, ModuleCard.jsx

**src/services/**
- Functions that talk to the backend
- All API calls should go through here (don't scatter fetch() calls everywhere)

**src/hooks/**
- Custom React hooks for shared logic
- Examples: useAuth (check if user is logged in), useFetch (fetch data from API)

## Backend Organization

```
backend/
├── app/
│   ├── routers/       # API endpoints (what URLs the frontend can call)
│   ├── services/      # Business logic (the actual work)
│   ├── models/        # Database table definitions
│   ├── data/          # Static data (FAQs, training content)
│   ├── main.py        # Entry point, sets up the server
│   └── database.py    # Database connection setup
├── requirements.txt   # Python dependencies
└── Dockerfile         # Instructions for building the backend container
```

### Key Backend Files to Know

**app/main.py**
- Creates the FastAPI application
- Registers all the routers (connects URLs to functions)
- Sets up middleware (CORS, authentication, etc.)

**app/routers/**
- Each file defines a group of related endpoints
- Examples: auth.py (login/logout), training.py (training modules), faq.py (FAQ questions)
- These are like the menu in a restaurant - they list what you can order

**app/services/**
- The actual logic that does the work
- Routers call services, services do the heavy lifting
- Keeps routers clean and focused

**app/models/**
- Define what the database tables look like
- Uses SQLAlchemy (Python library for databases)
- Each model is a table: User, TrainingModule, FAQQuestion, etc.

**app/data/**
- Static content that gets loaded into the database
- FAQs, training modules, initial user data
- See knowledge-sources.md for details on structure

**app/database.py**
- Sets up the connection to PostgreSQL
- Creates tables if they don't exist
- Provides database sessions for queries

## How Frontend and Backend Communicate

Here's the flow when a user views the FAQ page:

1. **User visits** `/faq` in their browser
2. **Frontend routing** (App.jsx) shows the FAQ.jsx component
3. **FAQ.jsx** calls `getFAQs()` from services/api.js
4. **API service** makes a GET request to `http://localhost:8000/api/faq`
5. **Backend router** (routers/faq.py) receives the request
6. **Router** calls a service function to get FAQ data
7. **Service** queries the database for FAQ questions
8. **Database** returns the data
9. **Service** processes it (maybe formats it, filters it, etc.)
10. **Router** sends JSON response back to frontend
11. **Frontend** receives the data and displays it

### API Endpoints

All backend URLs start with `/api`:

- `GET /api/faq` - Get all FAQ questions
- `GET /api/training` - Get all training modules
- `POST /api/auth/login` - Log in a user
- `GET /api/users/me` - Get current user info

The frontend calls these endpoints to get data or perform actions.

### Data Flow

```
User Interaction → Frontend Component → API Service → Backend Router →
Backend Service → Database → Backend Service → Backend Router →
API Service → Frontend Component → User Sees Result
```

## Configuration Files

### docker-compose.yml

Defines three services:
- **frontend:** React dev server on port 5173
- **backend:** FastAPI server on port 8000
- **db:** PostgreSQL database on port 5432

See docker-explained.md for a deep dive.

### .env Files

Environment variables for configuration:

**frontend/.env**
- `VITE_API_URL` - Where to find the backend (usually http://localhost:8000)

**backend/.env**
- `DATABASE_URL` - How to connect to PostgreSQL
- `SECRET_KEY` - For encrypting passwords and tokens

Never commit .env files to git. They contain secrets.

## Where to Make Changes

### Adding a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `frontend/src/components/Header.jsx`

### Adding a New API Endpoint

1. Create function in `backend/app/routers/`
2. Register router in `backend/app/main.py`
3. Create service function in `backend/app/services/`
4. Create frontend API call in `frontend/src/services/`

### Modifying Training Content

1. Edit files in `backend/app/data/`
2. Restart backend container to reload data

### Styling Changes

Frontend uses Tailwind CSS (utility-first CSS framework):
- Add classes directly in JSX: `className="bg-blue-500 text-white p-4"`
- Global styles in `frontend/src/index.css`

## Database

PostgreSQL running in a Docker container.

**Connection details:**
- Host: localhost (or `db` from inside other containers)
- Port: 5432
- Database: arnett
- User: arnett_user
- Password: (check docker-compose.yml or .env)

**Tables:**
- users
- training_modules
- faq_categories
- faq_questions
- user_progress (tracks which modules users have completed)

Data persists in a Docker volume, so it survives container restarts.

To completely reset the database:

```bash
docker compose down -v
docker compose up
```

## Development Workflow

Typical workflow for making changes:

1. **Start containers:** `docker compose up`
2. **Edit code** on your computer (not inside containers)
3. **Save file** - changes auto-reload:
   - Frontend: Hot module replacement (instant)
   - Backend: Auto-restart (takes a few seconds)
4. **Refresh browser** to see changes
5. **Check logs** if something breaks
6. **Commit changes** when everything works

## Next Steps

Now that you know where everything lives:
- Explore the codebase - open files and read the code
- Try making a small change (like changing some text on the dashboard)
- Follow the data flow for a feature end-to-end
- Look at knowledge-sources.md to understand the training content structure
