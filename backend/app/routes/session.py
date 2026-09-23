from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.gemini_service import generate_response
import json

router = APIRouter()


class InterviewSession(BaseModel):
    session_id: str
    candidate_name: str
    number_of_questions: int = 5
    difficulty: str = "beginner"
    interview_type: str = "technical"
    questions: List[str] = []
    answers: List[str] = []
    scores: List[int] = []
    feedback: List[str] = []
    strengths: List[str] = []
    improvements: List[str] = []
    current_question: int = 0
    interview_completed: bool = False


class AnswerSubmission(BaseModel):
    question: str
    answer: str
    score: int = 0


sessions = {}


@router.post("/start")
def start_session(
    candidate_name: str,
    number_of_questions: int = 5,
    difficulty: str = "beginner",
    interview_type: str = "technical"
):

    session_id = f"session_{len(sessions) + 1}"

    session = InterviewSession(
        session_id=session_id,
        candidate_name=candidate_name,
        number_of_questions=number_of_questions,
        difficulty=difficulty,
        interview_type=interview_type
    )

    sessions[session_id] = session

    return {
        "message": "Interview session started",
        "session": session
    }


@router.post("/{session_id}/next")
def get_next_question(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session = sessions[session_id]

    if len(session.questions) >= session.number_of_questions:
        session.interview_completed = True

        return {
            "message": "Interview completed",
            "interview_completed": True,
            "session_id": session.session_id
        }

    session.current_question = len(session.questions) + 1

    return {
        "message": "Ready for next question",
        "question_number": session.current_question,
        "interview_completed": False,
        "session_id": session.session_id
    }


@router.post("/{session_id}/submit-answer")
def submit_interview_answer(
    session_id: str,
    submission: AnswerSubmission
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session = sessions[session_id]

    session.questions.append(submission.question)
    session.answers.append(submission.answer)
    session.scores.append(submission.score)

    if len(session.questions) >= session.number_of_questions:

        session.interview_completed = True

        return {
            "message": "Interview completed",
            "interview_completed": True,
            "session_id": session.session_id
        }

    session.current_question = len(session.questions) + 1

    return {
        "message": "Answer saved successfully",
        "interview_completed": False,
        "session_id": session.session_id,
        "question_number": session.current_question,
        "score": submission.score
    }


@router.get("/{session_id}")
def get_session(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    return {
        "session": sessions[session_id]
    }



@router.get("/{session_id}/report")
def get_interview_report(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session = sessions[session_id]

    total_questions = len(session.questions)

    if total_questions == 0:
        average_score = 0
    else:
        average_score = sum(session.scores) / total_questions

    total_score = sum(session.scores)
    maximum_score = total_questions * 10

    if maximum_score > 0:
        percentage = (total_score / maximum_score) * 100
    else:
        percentage = 0

    if percentage >= 80:
        performance = "Excellent"
    elif percentage >= 60:
        performance = "Good"
    elif percentage >= 40:
        performance = "Average"
    else:
        performance = "Needs Improvement"

    return {
        "candidate_name": session.candidate_name,
        "session_id": session.session_id,
        "number_of_questions": session.number_of_questions,
        "difficulty": session.difficulty,
        "interview_type": session.interview_type,
        "questions_answered": total_questions,
        "total_score": total_score,
        "maximum_score": maximum_score,
        "average_score": round(average_score, 2),
        "percentage": round(percentage, 2),
        "performance": performance,
        "questions": session.questions,
"answers": session.answers,
"scores": session.scores,
"feedback": session.feedback,
"strengths": session.strengths,
"improvements": session.improvements
    }

@router.post("/{session_id}/evaluate-answer")
def evaluate_and_save_answer(
    session_id: str,
    submission: AnswerSubmission
):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session = sessions[session_id]

    prompt = f"""
    You are an AI interviewer.

    Evaluate the candidate's answer.

    Question:
    {submission.question}

    Candidate Answer:
    {submission.answer}

    Difficulty:
    {session.difficulty}

    Interview Type:
    {session.interview_type}

    Return ONLY valid JSON:

    {{
        "score": 8,
        "feedback": "Short feedback",
        "strength": "One strength",
        "improvement": "One improvement"
    }}

    Rules:
    - Score must be an integer from 0 to 10.
    - Do not add markdown.
    - Do not add text outside the JSON.
    """

    try:
        evaluation_text = generate_response(prompt)
        evaluation = json.loads(evaluation_text)

    except Exception as e:
        error_message = str(e)

        if "429" in error_message or "Rate limit exceeded" in error_message:
            raise HTTPException(
                status_code=429,
                detail="AI evaluation is temporarily unavailable because the Gemini API daily quota has been reached."
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to evaluate the answer."
        )
    score = evaluation["score"]

    session.questions.append(submission.question)
    session.answers.append(submission.answer)
    session.scores.append(score)
    session.feedback.append(evaluation["feedback"])
    session.strengths.append(evaluation["strength"])
    session.improvements.append(evaluation["improvement"])
    if len(session.questions) >= session.number_of_questions:
            session.interview_completed = True
    else:
            session.current_question = len(session.questions) + 1

    return {
        "message": "Answer evaluated and saved successfully",
        "evaluation": evaluation,
        "interview_completed": session.interview_completed,
        "session_id": session.session_id
    }