import json
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini_service import generate_response

router = APIRouter()


class QuestionRequest(BaseModel):
    resume_analysis: dict
    job_analysis: dict
    difficulty: str = "beginner"
    interview_type: str = "technical"


@router.post("/generate")
def generate_interview_question(request: QuestionRequest):

    prompt = f"""
    You are an AI interviewer conducting a {request.interview_type} interview.

    Generate ONE interview question based on the candidate's resume
    and the requirements of the job.

    Candidate Resume Analysis:
    {json.dumps(request.resume_analysis)}

    Job Description Analysis:
    {json.dumps(request.job_analysis)}

    Interview Difficulty:
    {request.difficulty}

    Interview Type:
    {request.interview_type}

    Rules:
    - Ask only ONE question.
    - The question must be relevant to both the candidate and the job.
    - Match the requested difficulty level.
    - Match the interview type.
    - Prefer questions about skills, projects, or technical concepts.
    - Do not ask generic questions.
    - Return ONLY the question.
    """

    question = generate_response(prompt)

    return {
        "question": question,
        "difficulty": request.difficulty,
        "interview_type": request.interview_type
    }