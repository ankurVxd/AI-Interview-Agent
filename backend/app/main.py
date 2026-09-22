from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.interview import router as interview_router
from app.routes.evaluation import router as evaluation_router
from app.routes.session import router as session_router
from app.routes.resume import router as resume_router
from app.routes.job import router as job_router
from app.routes.question import router as question_router
app = FastAPI(
    title="AI Interview Agent API",
    description="Backend API for the Agentic AI Interview System",
    version="1.0.0"
)
app.include_router(interview_router, prefix="/interview", tags=["Interview"])
app.include_router(
    evaluation_router,
    prefix="/interview",
    tags=["Interview"]
)
app.include_router(
    session_router,
    prefix="/interview/session",
    tags=["Interview Session"]
)
app.include_router(
    resume_router,
    prefix="/resume",
    tags=["Resume"]
)
app.include_router(
    job_router,
    prefix="/job",
    tags=["Job Description"]
)
app.include_router(
    question_router,
    prefix="/question",
    tags=["Question Generation"]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Interview Agent Backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }