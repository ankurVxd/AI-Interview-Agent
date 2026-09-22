import json

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import generate_response

router = APIRouter()


class QuestionRequest(BaseModel):
    resume_analysis: dict
    job_analysis: dict


@router.post("/generate")
def generate_interview_question(request: QuestionRequest):

    prompt = f"""
    You are an AI technical interviewer.

    Generate ONE interview question based on the candidate's resume
    and the requirements of the job.

    Candidate Resume Analysis:
    {json.dumps(request.resume_analysis)}

    Job Description Analysis:
    {json.dumps(request.job_analysis)}

    Rules:
    - Ask only ONE question.
    - The question must be relevant to both the candidate and the job.
    - Prefer questions about skills, projects, or technical concepts.
    - Do not ask generic questions.
    - Start with an appropriate interview question.
    - Return ONLY the question.
    """

    question = generate_response(prompt)

    return {
        "question": question
    }