# Adaptive Agentic Interviewer — Frontend

This frontend follows the project flow described in the project presentation:
1. Resume + Job Description input
2. Candidate profile and role analysis
3. Adaptive technical / HR / project interview
4. Dynamic difficulty and follow-up UI
5. Final performance report

## Technologies
- React
- Vite
- Tailwind CSS
- Lucide React icons

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:
http://localhost:5173

## Connect the FastAPI backend

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The current UI uses mock analysis/questions/report data so it can run before the backend is ready.

Recommended FastAPI endpoints to connect next:

POST /api/analyze
- multipart/form-data
- resume: PDF
- job_description: string
- mode: Technical | HR | Project

POST /api/interview/start
- candidate/session information
- returns first question

POST /api/interview/answer
- session_id
- question_id
- answer
- returns evaluation + next adaptive question

GET /api/interview/{session_id}/report
- returns final scores, strengths, weaknesses and suggestions

The PPT specifies FastAPI for REST APIs, LangGraph for agent workflow, Gemini for question generation/evaluation, PyMuPDF for resume parsing and SQLite for persistence.
