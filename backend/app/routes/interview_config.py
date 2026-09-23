from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class InterviewConfig(BaseModel):
    candidate_name: str
    number_of_questions: int = 5
    difficulty: str = "beginner"
    interview_type: str = "technical"


@router.post("/configure")
def configure_interview(config: InterviewConfig):

    if config.number_of_questions < 1:
        return {
            "error": "Number of questions must be at least 1"
        }

    if config.number_of_questions > 20:
        return {
            "error": "Number of questions cannot exceed 20"
        }

    allowed_difficulties = ["beginner", "intermediate", "advanced"]

    if config.difficulty.lower() not in allowed_difficulties:
        return {
            "error": "Difficulty must be beginner, intermediate, or advanced"
        }

    allowed_types = ["technical", "hr", "mixed"]

    if config.interview_type.lower() not in allowed_types:
        return {
            "error": "Interview type must be technical, hr, or mixed"
        }

    return {
        "message": "Interview configured successfully",
        "configuration": {
            "candidate_name": config.candidate_name,
            "number_of_questions": config.number_of_questions,
            "difficulty": config.difficulty.lower(),
            "interview_type": config.interview_type.lower()
        }
    }