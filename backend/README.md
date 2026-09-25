# ChatFiles - Backend

Backend service for **ChatFiles**, an AI-powered application for uploading files and interacting with their content using natural language.

## Tech Stack

* **Python**
* **FastAPI**
* **SQLAlchemy**
* **PostgreSQL**
* **Alembic**
* **Pydantic Settings**
* **AsyncPG**
* **uv**

## Backend Folder Structure

```text
backend/
├── src/
│   ├── api/
│   ├── core/
│   │   └── config.py
│   ├── database/
│   │   ├── alembic/
│   │   │   ├── versions/
│   │   │   └── env.py
│   │   ├── engine.py
│   │   └── models/
│   └── main.py
│
├── alembic.ini
├── .env
├── pyproject.toml
└── README.md
```

## Requirements

Make sure you have:

* Python 3.13+
* PostgreSQL
* [uv](https://docs.astral.sh/uv/)

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd backend
```

Install dependencies:

```bash
uv sync
```

## Environment Variables

change `.env.example` to `.env` file in the backend root and fil it with your environment variables


## Database

ChatFiles uses **PostgreSQL** with **SQLAlchemy Async**.

The database URL is generated from the database environment variables:

```text
postgresql+asyncpg://USER:PASSWORD@HOST:PORT/DATABASE
```

## Database Migrations

ChatFiles uses **Alembic** to manage database schema migrations.

### Create a Migration

After creating or modifying a SQLAlchemy model:

```bash
uv run alembic revision --autogenerate -m "describe changes"
```

Example:

```bash
uv run alembic revision --autogenerate -m "create users table"
```

Always review the generated migration before applying it.

### Apply Migrations

Apply all pending migrations:

```bash
uv run alembic upgrade head
```

### Check Current Migration

```bash
uv run alembic current
```

### View Migration History

```bash
uv run alembic history
```

### Roll Back the Last Migration

```bash
uv run alembic downgrade -1
```

### Roll Back All Migrations

```bash
uv run alembic downgrade base
```

### Create an Empty Migration

For migrations that need to be written manually:

```bash
uv run alembic revision -m "migration description"
```

## Migration Workflow

When changing a database model:

```text
Modify SQLAlchemy Model
        ↓
Generate Migration
        ↓
Review Migration
        ↓
Apply Migration
```

Commands:

```bash
uv run alembic revision --autogenerate -m "describe changes"
uv run alembic upgrade head
```

Migration files are stored in:

```text
src/database/alembic/versions/
```

## Run the Application

Start the FastAPI development server:

```bash
uv run uvicorn src.main:app --reload
```

The API will be available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

Alternative API documentation:

```text
http://localhost:8000/redoc
```

## Development

Install or synchronize dependencies:

```bash
uv sync
```

Run the application:

```bash
uv run uvicorn src.main:app --reload
```

Generate a migration:

```bash
uv run alembic revision --autogenerate -m "describe changes"
```

Apply migrations:

```bash
uv run alembic upgrade head
```

## Production

Before deploying:

1. Build the Docker image.
2. Configure production environment variables.
3. Start PostgreSQL.
4. Apply database migrations.
5. Start the FastAPI application.
