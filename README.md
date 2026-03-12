# MOMOCRI AI School Platform

AI活用Webデザインスクールのフルスタックアプリケーション

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Django 5 + Django REST Framework + PostgreSQL
- **Auth**: JWT (djangorestframework-simplejwt)
- **Infrastructure**: Docker Compose (PostgreSQL + Redis)

## Getting Started

### Prerequisites

- Node.js 20+, pnpm
- Python 3.12+
- Docker & Docker Compose

### 1. Start Infrastructure

```bash
docker compose up -d
```

### 2. Backend Setup

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs/`

### 3. Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs at `http://localhost:3000`

## Project Structure

```
ai-school-platform/
├── frontend/          # Next.js 16
│   └── src/
│       ├── app/
│       │   ├── (public)/     # LP, auth, legal pages
│       │   ├── (student)/    # Student dashboard & learning
│       │   ├── (admin)/      # Admin management
│       │   └── (corp)/       # Corporate management
│       ├── components/
│       │   ├── layouts/      # Sidebar, Header, Logo
│       │   └── ui/           # Shadcn UI components
│       ├── lib/              # API client, auth, utils
│       └── types/            # TypeScript definitions
├── backend/           # Django + DRF
│   ├── config/        # Settings (base/dev/prod)
│   ├── core/          # Shared models, pagination, permissions
│   ├── accounts/      # User model, JWT auth
│   ├── courses/       # Course, Chapter, Lesson
│   ├── enrollments/   # Enrollment, Progress
│   └── ...            # Other apps
└── docker-compose.yml # PostgreSQL + Redis
```

## Available Pages

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Registration |
| `/reset-password` | Password reset |
| `/legal/*` | Legal pages |
| `/dashboard` | Student dashboard |
| `/admin` | Admin dashboard |
| `/corp` | Corporate management |
