# backend/main.py
# Simple Python backend using FastAPI + Ollama (free local AI)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import httpx
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    user: str
    ai: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    image: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    success: bool

# Option 1: Call Ollama (free local model)
async def call_ollama(message: str, history: List[Message]) -> Optional[str]:
    try:
        # Build conversation context
        context = "\n".join([f"User: {h.user}\nAI: {h.ai}" for h in history[-5:]])
        full_prompt = f"""You are a helpful AI productivity coach. Help users with task management, scheduling, focus, and motivation.

Previous conversation:
{context}

User: {message}
AI:"""

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama2",  # or "phi", "mistral"
                    "prompt": full_prompt,
                    "stream": False
                }
            )
            data = response.json()
            return data.get("response", "").strip()
    except Exception as e:
        print(f"Ollama error: {e}")
        return None

# Option 2: Simple rule-based fallback
def simple_response(message: str) -> str:
    lower = message.lower()
    
    responses = {
        "procrastinat": "I understand procrastination can be frustrating. Let's break this down: what specific task are you avoiding? I can help you create smaller, manageable steps that feel less overwhelming.",
        "deadline": "Deadlines can create pressure! Let me help you create a realistic timeline. When is your deadline, and what does your task involve? I'll help you work backwards to create a manageable schedule.",
        "focus": "Staying focused is a skill we can build together. Try the 25-minute Focus Sprint: work for 25 minutes, then take a 5-minute break. I can send you reminders to keep you on track!",
        "motivat": "Motivation comes and goes, but systems create consistency. Let's identify your 'why' for this task and create small wins that build momentum. What outcome are you hoping to achieve?",
        "break down": "Perfect! Let's break down your project step by step. First, tell me: What's the main goal of your project? Then we can identify the key milestones and create actionable tasks for each one.",
        "schedule": "Great idea! Let's create a realistic schedule. How much time do you typically have available each day? I'll help you optimize your schedule around your natural energy patterns.",
        "distract": "The distraction blocker feature can help! Let's identify what's pulling your attention away and create strategies to minimize those interruptions during your focus time."
    }
    
    for keyword, response in responses.items():
        if keyword in lower:
            return response
    
    return "That's a great point! Can you tell me more about what specific challenges you're facing? I'm here to provide personalized strategies that work for your situation."

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Try Ollama first
        response = await call_ollama(request.message, request.history)
        
        # Fallback to simple responses if Ollama fails
        if not response:
            response = simple_response(request.message)
        
        return ChatResponse(response=response, success=True)
    
    except Exception as e:
        print(f"Error: {e}")
        # Always return something helpful
        return ChatResponse(
            response=simple_response(request.message),
            success=False
        )

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "ollama_available": await check_ollama()
    }

async def check_ollama():
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            await client.get("http://localhost:11434/api/tags")
            return True
    except:
        return False

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    print("💡 Make sure Ollama is running: ollama run llama2")
    print("📡 API will be available at: http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)