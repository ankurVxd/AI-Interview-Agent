from fastapi import APIRouter, UploadFile, HTTPException
import fitz

from app.services.resume_analyzer import analyze_resume

router = APIRouter()


@router.post("/analyze")
async def analyze_uploaded_resume(file: UploadFile):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    try:
        file_bytes = await file.read()

        pdf_document = fitz.open(
            stream=file_bytes,
            filetype="pdf"
        )

        text = ""

        for page in pdf_document:
            text += page.get_text()

        pdf_document.close()

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the PDF."
            )

        analysis = analyze_resume(text)

        return {
            "filename": file.filename,
            "message": "Resume analyzed successfully",
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as e:
     print("RESUME ANALYSIS ERROR:", repr(e))
    raise HTTPException(
        status_code=500,
        detail=f"Failed to analyze resume: {str(e)}"
    )