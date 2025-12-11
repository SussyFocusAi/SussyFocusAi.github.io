# backend/main.py (Modified for Structured Output)

import os
import base64
import json
from io import BytesIO
from PIL import Image

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# Import the Gemini SDK
from google import genai
from google.genai import types

# --- 1. CONFIGURATION ---
# (Client initialization remains the same)
try:
    client = genai.Client()
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    print("Please ensure your GEMINI_API_KEY environment variable is set.")
    client = None

# Initialize FastAPI App (CORS setup remains the same)
app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware, allow_origins=origins, allow_credentials=True, 
    allow_methods=["*"], allow_headers=["*"]
)

# --- 2. DATA MODELS (Pydantic) ---

# Backend version of the Task structure
class Task(BaseModel):
    id: int = Field(description="A unique timestamp for the task.")
    text: str = Field(description="The descriptive text of the task.")
    completed: bool = Field(description="The completion status of the task.")

class MessageHistory(BaseModel):
    user: str
    ai: str

class Context(BaseModel):
    tasks: List[Task]
    currentGoal: str

class ChatRequest(BaseModel):
    message: str
    image: Optional[str] = None
    history: List[MessageHistory]
    context: Context

# 🌟 NEW: Structured Response Schema for Gemini 🌟
class AIResponse(BaseModel):
    """The required JSON structure for the AI's response."""
    response_text: str = Field(description="The friendly, conversational text response to the user's message.")
    tasks: List[Task] = Field(description="The complete, updated list of all tasks. Use the existing tasks from the context and add/modify new ones based on the conversation.")
    goal: str = Field(description="The primary current goal the user is focused on. Extract from the conversation.")

# --- 3. HELPER FUNCTIONS (convert_base64_to_image and convert_history_to_gemini remain the same) ---
def convert_base64_to_image(base64_string: str) -> Image.Image:
    # ... (Keep this function as it was)
    if "," in base64_string:
        _, base64_string = base64_string.split(",", 1)
    image_bytes = base64.b64decode(base64_string)
    return Image.open(BytesIO(image_bytes))

def convert_history_to_gemini(history: List[MessageHistory]) -> List[types.Content]:
    # ... (Keep this function as it was)
    gemini_history = []
    system_instruction = (
        "You are an AI Productivity Coach. Your goal is to help the user set, track, "
        "and complete tasks and goals. Your entire response MUST be a valid JSON object "
        "that adheres strictly to the AIResponse schema, including the 'response_text', 'tasks', and 'goal' fields. "
        "Analyze the user's request and update the provided 'tasks' and 'goal' if necessary, then return the complete list."
    )
    gemini_history.append(types.Content(role="system", parts=[types.Part.from_text(system_instruction)]))
    
    for msg in history:
        if msg.user:
            gemini_history.append(types.Content(role="user", parts=[types.Part.from_text(msg.user)]))
        if msg.ai:
            gemini_history.append(types.Content(role="model", parts=[types.Part.from_text(msg.ai)]))
            
    return gemini_history


# --- 4. API ENDPOINTS ---

@app.get("/health")
def health_check():
    # ... (Health check remains the same)
    if client is None:
        raise HTTPException(status_code=500, detail="Gemini client not initialized. Check API Key.")
    return {"status": "ok", "message": "AI Coach Backend is Online"}

@app.post("/api/chat")
async def chat_handler(request_data: ChatRequest):
    if client is None:
        raise HTTPException(status_code=500, detail="Gemini client not initialized.")
        
    try:
        # Prepare the current prompt parts
        prompt_parts = []
        
        # 🌟 Crucial: Pass current tasks and goal as context to the model 🌟
        context_prompt = (
            f"User's current message: {request_data.message}\n"
            f"Current Goal: {request_data.context.currentGoal}\n"
            f"Current Tasks (JSON array): {json.dumps([t.dict() for t in request_data.context.tasks])}\n\n"
            "Based on the full context above, generate the JSON output following the AIResponse schema."
        )
        prompt_parts.append(context_prompt)
        
        if request_data.image:
            image_part = convert_base64_to_image(request_data.image)
            prompt_parts.append(image_part)
        
        # Convert history and combine with current user prompt
        gemini_history = convert_history_to_gemini(request_data.history)
        full_contents = gemini_history + [types.Content(role="user", parts=prompt_parts)]

        # 🌟 Call the Gemini API with Structured Output parameters 🌟
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=full_contents,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AIResponse, # Passes the Pydantic schema
            ),
        )

        # 5. Process Response
        
        # The response.text is guaranteed to be a valid JSON string matching AIResponse
        response_json = json.loads(response.text)
        
        # Return the structured data directly
        return {
            "response": response_json['response_text'],
            "tasks": response_json['tasks'],
            "goal": response_json['goal']
        }

    except Exception as e:
        print(f"Gemini API Error: {e}")
        # In case of API failure or JSON parsing issue, return a fallback message
        fallback_tasks = [t.dict() for t in request_data.context.tasks]
        
        return {
            "response": f"Sorry, a structured response error occurred: {str(e)}",
            "tasks": fallback_tasks,
            "goal": request_data.context.currentGoal
        }

# --- 5. RUN SERVER COMMAND ---
# Run this command in your terminal:
# uvicorn main:app --reload --port 8000