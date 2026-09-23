import json
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini_service import generate_response

router = APIRouter()


class AnswerRequest(BaseModel):
    question: str
    answer: str
    difficulty: str = "beginner"
    interview_type: str = "technical"


class EvaluationResponse(BaseModel):
    score: int
    feedback: str
    strength: str
    improvement: str


@router.post("/evaluate-answer", response_model=EvaluationResponse)
def evaluate_answer(request: AnswerRequest):

    prompt = f"""
    You are an AI {request.interview_type} interviewer.

    Evaluate the candidate's answer to the following question.

    Question:
    {request.question}

    Candidate Answer:
    {request.answer}

    Difficulty:
    {request.difficulty}

    Interview Type:
    {request.interview_type}

    Return ONLY valid JSON in exactly this format:

    {{
        "score": 8,
        "feedback": "Short explanation of the answer quality.",
        "strength": "One major strength.",
        "improvement": "One area to improve."
    }}

    Rules:
    - Score must be an integer from 0 to 10.
    - Evaluate according to the requested difficulty.
    - Keep feedback short and clear.
    - Do not add markdown.
    - Do not add any text outside the JSON.
    """

    evaluation_text = generate_response(prompt)

    evaluation = json.loads(evaluation_text)

    return evaluation