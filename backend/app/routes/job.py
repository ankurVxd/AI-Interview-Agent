import json

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import generate_response

router = APIRouter()


class JobDescriptionRequest(BaseModel):
    job_description: str


@router.post("/analyze")
def analyze_job_description(request: JobDescriptionRequest):

    prompt = f"""
    You are an AI job description analyzer.

    Analyze the following job description.

    Job Description:
    {request.job_description}

    Return ONLY valid JSON in exactly this format:

    {{
        "required_skills": [],
        "preferred_skills": [],
        "responsibilities": [],
        "experience_requirements": [],
        "education_requirements": []
    }}

    Rules:
    - Extract only information present in the job description.
    - Do not invent information.
    - Keep each item short and clear.
    - Return empty lists when information is not available.
    - Do not add markdown.
    - Do not add any text outside the JSON.
    """

    try:
        response = generate_response(prompt)

        analysis = json.loads(response)

        return {
            "message": "Job description analyzed successfully",
            "analysis": analysis
        }

    except Exception as e:
        return {
            "error": str(e)
        }