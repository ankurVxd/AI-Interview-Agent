import json

from app.services.gemini_service import generate_response


def analyze_resume(resume_text: str):

    prompt = f"""
    You are an AI resume analyzer.

    Analyze the following candidate resume.

    Resume:
    {resume_text}

    Return ONLY valid JSON in exactly this format:

    {{
        "skills": [],
        "education": [],
        "projects": [],
        "certifications": [],
        "experience": []
    }}

    Rules:
    - Extract only information present in the resume.
    - Do not invent information.
    - Keep each item short.
    - Return empty lists when information is not available.
    - Do not add markdown.
    - Do not add any text outside the JSON.
    """

    response = generate_response(prompt)

    return json.loads(response)