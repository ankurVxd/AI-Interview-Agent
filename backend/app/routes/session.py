from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


class InterviewSession(BaseModel):
    session_id: str
    candidate_name: str
    questions: List[str] = []
    answers: List[str] = []
    scores: List[int] = []
    current_question: int = 0
    interview_completed: bool = False


class AnswerSubmission(BaseModel):
    question: str
    answer: str
    score: int


sessions = {}


@router.post("/start")
def start_session(candidate_name: str):

    session_id = f"session_{len(sessions) + 1}"

    session = InterviewSession(
        session_id=session_id,
        candidate_name=candidate_name
    )

    sessions[session_id] = session

    return {
        "message": "Interview session started",
        "session": session
    }


@router.post("/{session_id}/answer")
def submit_answer(
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

    return {
        "message": "Answer saved successfully",
        "session": session
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

    return {
        "candidate_name": session.candidate_name,
        "session_id": session.session_id,
        "questions_answered": total_questions,
        "total_score": sum(session.scores),
        "average_score": round(average_score, 2),
        "questions": session.questions,
        "answers": session.answers,
        "scores": session.scores
    }
@router.post("/{session_id}/next")
def get_next_question(session_id: str):

    if session_id not in sessions:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )

    session = sessions[session_id]

    # Maximum number of questions for the interview
    max_questions = 5

    # Check whether interview is completed
    if len(session.questions) >= max_questions:
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