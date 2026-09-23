from app.services.gemini_service import generate_response

result = generate_response(
    "In one short sentence, explain what an AI interview agent does."
)

print("Gemini response:")
print(result)