from fastapi import APIRouter
from app.services.gemini_service import generate_response

router = APIRouter()


@router.post("/generate-question")
def generate_question():
    prompt = """
    You are an AI technical interviewer.

    Generate one beginner-level technical interview question
    for a B.Tech Computer Science student.

    Return only the question.
    """

    question = generate_response(prompt)

    return {
        "question": question
    }