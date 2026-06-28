# Forged Resume

A full-stack resume builder where you fill in your details on the left and watch your resume come together in real time on the right. When you're done, export it as a PDF straight from the browser.

**Live Demo:** https://forged-resume-1.onrender.com  
**Backend API:** https://forged-resume.onrender.com

---

## What it does

- Split-screen editor — form on the left, live A4 preview on the right
- Fill in your basics, skills, work experience, education, and references
- Preview updates instantly as you type
- Save your progress to the backend (persisted in SQLite)
- Export as PDF using the browser's native print dialog

---

## Tech Stack

**Frontend** — React + Vite, plain inline styles, Axios for API calls  
**Backend** — Flask, SQLite, Flask-CORS, Gunicorn  
**Deployed on** — Render (Web Service for backend, Static Site for frontend)

---

## Project Structure

```
ResumeBuilder/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # create_app(), init_db()
│   │   ├── routes.py         # GET /api/resume, POST /api/resume
│   │   ├── models.py
│   │   └── schemas.py
│   └── run.py                # entry point for gunicorn
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # entire UI lives here
│   │   └── main.jsx
│   └── vite.config.js
├── requirements.txt
├── render.yaml
└── README.md
```

---

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python run.py
```

Backend runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Environment Variables

Create a `.env` file inside `backend/app/` using the example below:

```
# backend/app/.env.example
FLASK_ENV=development
SECRET_KEY=your_secret_key_here
```

Create a `.env` file inside `frontend/` using the example below:

```
# frontend/.env.example
VITE_API_URL=https://forged-resume.onrender.com/api/resume
```

For local development set `VITE_API_URL=http://localhost:5000/api/resume`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume` | Fetch saved resume data |
| POST | `/api/resume` | Save resume data |

The POST endpoint returns `400 Bad Request` if `basics.full_name` or `basics.email` are missing, or if there's no education or work experience entry.

---

## Assumptions

- Single-user setup — one resume stored at ID 1 in SQLite. Multi-user support with auth is planned as a future extension.
- PDF export uses the browser's native print dialog. Select "Save as PDF" as the destination when the dialog opens.
- SQLite database is created automatically on first run — no manual setup needed.
- Render spins down the backend after inactivity so the first load might take 30–50 seconds. Subsequent requests are fast.
