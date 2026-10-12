import os
from google import genai
from google.genai import types
from google.genai import errors
from dotenv import load_dotenv

# Gemma 4 via the Gemini API (Best Use of Gemma 4)
load_dotenv()

def get_client():
    load_dotenv(override=True)
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is missing from environment")
    return genai.Client(api_key=api_key)

def generate_verdict(prompt, image_bytes=None, mime_type=None):
    client = get_client()
    primary_model = os.getenv("GEMMA_MODEL", "gemma-4-31b-it")
    if primary_model and "GEMMA_MODEL=" in primary_model:
        primary_model = primary_model.split("GEMMA_MODEL=")[-1].strip()
    primary_model = primary_model.strip() if primary_model else "gemma-4-31b-it"

    models_to_try = [
        primary_model,
        "gemma-4-31b-it",
        "gemma-4-26b-a4b-it",
    ]
    # Remove duplicates while preserving priority order
    models_to_try = list(dict.fromkeys(models_to_try))
    
    contents = []
    if image_bytes:
        contents.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type))
    contents.append(prompt)
    
    # Helper to call generate_content with json config then retry without
    def _call_model(target_model):
        try:
            return client.models.generate_content(
                model=target_model, 
                contents=contents,
                config=types.GenerateContentConfig(response_mime_type="application/json")
            )
        except Exception:
            return client.models.generate_content(
                model=target_model, 
                contents=contents
            )

    last_error = None
    for model in models_to_try:
        try:
            response = _call_model(model)
            if response and response.text:
                return response.text, model
        except Exception as e:
            last_error = e
            continue

    if last_error:
        raise last_error
    raise RuntimeError("Failed to generate verdict from all available models.")
