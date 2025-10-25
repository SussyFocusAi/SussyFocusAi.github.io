from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
from datetime import datetime
import os
from anthropic import Anthropic

app = FastAPI(title="FocusAI Productivity Coach API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client (you can also use OpenAI)
# Set your API key: export ANTHROPIC_API_KEY="your-key-here"
try:
    anthropic_client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    AI_ENABLED = True
except:
    AI_ENABLED = False
    print("⚠️  Warning: No AI API key found. Using fallback responses.")

# Data models
class HistoryItem(BaseModel):
    user: str
    ai: str

class Task(BaseModel):
    id: int
    text: str
    completed: bool

class ChatRequest(BaseModel):
    message: str
    image: Optional[str] = None
    history: List[HistoryItem] = []
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    response: str
    tasks: Optional[List[Task]] = None
    goal: Optional[str] = None

# In-memory storage
session_data = {
    "tasks": [],
    "current_goal": "",
    "focus_sessions": 0,
    "streak": 1
}

# AI System prompt
SYSTEM_PROMPT = """You are an AI productivity coach for FocusAI. Your role is to help users:

1. **Beat Procrastination**: Give actionable advice, break tasks into tiny steps
2. **Stay Focused**: Recommend Pomodoro technique, time-blocking strategies
3. **Set Goals**: Help create SMART goals and track progress
4. **Manage Tasks**: Help break down projects into manageable tasks
5. **Provide Motivation**: Give encouraging, empathetic support

**Your Style**:
- Be warm, encouraging, and empathetic
- Use emojis occasionally (not excessively)
- Keep responses concise but helpful (2-4 paragraphs max)
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Use bullet points for clarity when listing steps

**Task Management**:
- When users mention tasks, acknowledge them
- Suggest breaking big projects into smaller tasks
- Encourage realistic planning

**Remember**: You're a supportive coach, not just an information bot. Show empathy and understanding."""

def call_anthropic_ai(user_message: str, history: List[HistoryItem], context: Dict) -> str:
    """Call Claude AI for intelligent responses"""
    try:
        # Build conversation history
        messages = []
        for item in history[-3:]:  # Last 3 exchanges
            if item.user:
                messages.append({"role": "user", "content": item.user})
            if item.ai:
                messages.append({"role": "assistant", "content": item.ai})
        
        # Add context
        context_str = ""
        if context.get("currentGoal"):
            context_str += f"\n[User's Current Goal: {context['currentGoal']}]"
        if context.get("tasks"):
            tasks_list = [t['text'] for t in context['tasks'] if not t['completed']]
            if tasks_list:
                context_str += f"\n[Active Tasks: {', '.join(tasks_list[:3])}]"
        
        # Add current message with context
        current_msg = user_message
        if context_str:
            current_msg += context_str
        
        messages.append({"role": "user", "content": current_msg})
        
        # Call Claude
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        
        return response.content[0].text
    
    except Exception as e:
        print(f"AI Error: {e}")
        return fallback_response(user_message)

def fallback_response(user_message: str) -> str:
    """Smart fallback responses when AI is unavailable"""
    lower = user_message.lower()
    
    responses = {
        "procrastination": "I understand procrastination is tough! 💪\n\n**Try the 2-Minute Rule**: If a task takes less than 2 minutes, do it now. For bigger tasks, commit to just 5 minutes - momentum builds naturally!\n\n**What's the smallest step** you can take right now?",
        
        "focus": "Let's boost your focus! 🎯\n\n**Pomodoro Technique**:\n• 25 minutes focused work\n• 5 minute break\n• Repeat 4 times, then longer break\n\n**Remove distractions**: Phone away, close extra tabs, tell others you're in focus mode.\n\nWhat will you focus on first?",
        
        "motivation": "Motivation comes and goes - discipline stays! 💪\n\n**Remember**: You don't need to feel motivated to start. Action creates motivation, not the other way around.\n\n**Start tiny**: Just 5 minutes. That's all. Future you will thank you!\n\nWhat's one small action you can take right now?",
        
        "goal": "Let's set a powerful goal! 🎯\n\n**SMART Framework**:\n• **Specific**: What exactly?\n• **Measurable**: How to track?\n• **Achievable**: Is it realistic?\n• **Relevant**: Why does it matter?\n• **Time-bound**: When's the deadline?\n\nTell me your goal, and I'll help make it concrete!",
        
        "schedule": "Smart planning = better performance! 📅\n\n**Time-Blocking Strategy**:\n1. List top 3 priorities\n2. Assign specific time blocks\n3. Include buffer time\n4. Schedule breaks (not optional!)\n\n**Pro tip**: Do hardest tasks when your energy is highest.\n\nWhat are your top 3 priorities today?",
        
        "project": "Let's break this down! 🔍\n\n**Project Breakdown Method**:\n1. **End Goal**: What's the final result?\n2. **Milestones**: What are 3-5 major steps?\n3. **Action Items**: Break each into tasks\n4. **Timeline**: Assign deadlines\n5. **Next Action**: What's the very first step?\n\nTell me about your project!",
        
        "deadline": "Deadline pressure? Let's strategize! ⏰\n\n**Reverse Planning**:\n1. Deadline date?\n2. Available time?\n3. Must-do tasks?\n4. What can be simplified?\n5. Add buffer (things take longer!)\n\n**Emergency Mode**: Cut non-essentials, work in sprints, ask for help if needed.\n\nWhen's your deadline?",
    }
    
    # Match keywords
    for keyword, response in responses.items():
        if keyword in lower:
            return response
    
    # Default response
    return "I'm here to help you stay productive! 🚀\n\n**I can help with**:\n• Breaking down projects\n• Fighting procrastination\n• Creating schedules\n• Setting goals\n• Starting focus sessions\n• Managing tasks\n\nWhat's on your mind today?"

@app.get("/")
async def root():
    return {
        "message": "FocusAI Productivity Coach API",
        "version": "2.0.0",
        "ai_enabled": AI_ENABLED,
        "status": "online"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "ai_enabled": AI_ENABLED,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint with AI integration"""
    
    user_message = request.message.lower()
    response_text = ""
    updated_tasks = None
    updated_goal = None
    
    # Extract context
    context = request.context or {}
    if context:
        session_data["tasks"] = context.get("tasks", [])
        session_data["current_goal"] = context.get("currentGoal", "")
    
    # Task management commands
    if "add task" in user_message:
        task_text = user_message.split("add task")[-1].strip(": ")
        if task_text:
            new_task = {
                "id": int(datetime.now().timestamp() * 1000),
                "text": task_text,
                "completed": False
            }
            session_data["tasks"].append(new_task)
            updated_tasks = session_data["tasks"]
            response_text = f"✅ Added: '{task_text}'\n\nGreat! Let's tackle this. What's your plan of action?"
    
    elif "set goal" in user_message or "my goal is" in user_message:
        if "set goal" in user_message:
            goal_text = user_message.split("set goal")[-1].strip(": ")
        else:
            goal_text = user_message.split("my goal is")[-1].strip()
        
        if goal_text:
            session_data["current_goal"] = goal_text
            updated_goal = goal_text
            response_text = f"🎯 Goal set: '{goal_text}'\n\nAwesome! Let's break this into actionable steps. What's the first thing you need to do?"
    
    else:
        # Use AI if available, otherwise fallback
        if AI_ENABLED:
            response_text = call_anthropic_ai(
                request.message, 
                request.history,
                context
            )
        else:
            response_text = fallback_response(request.message)
    
    return ChatResponse(
        response=response_text,
        tasks=updated_tasks,
        goal=updated_goal
    )

@app.get("/api/tasks")
async def get_tasks():
    return {"tasks": session_data["tasks"]}

@app.post("/api/tasks")
async def create_task(task: Task):
    session_data["tasks"].append(task.dict())
    return {"message": "Task created", "task": task}

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: int, task: Task):
    for i, t in enumerate(session_data["tasks"]):
        if t["id"] == task_id:
            session_data["tasks"][i] = task.dict()
            return {"message": "Task updated", "task": task}
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: int):
    session_data["tasks"] = [t for t in session_data["tasks"] if t["id"] != task_id]
    return {"message": "Task deleted"}

@app.get("/api/stats")
async def get_stats():
    completed_tasks = len([t for t in session_data["tasks"] if t["completed"]])
    total_tasks = len(session_data["tasks"])
    
    return {
        "completed_tasks": completed_tasks,
        "total_tasks": total_tasks,
        "focus_sessions": session_data["focus_sessions"],
        "streak": session_data["streak"],
        "current_goal": session_data["current_goal"]
    }

@app.post("/api/focus-session/start")
async def start_focus_session():
    session_data["focus_sessions"] += 1
    return {
        "message": "Focus session started! 🎯",
        "duration": 25,
        "total_sessions": session_data["focus_sessions"]
    }

if __name__ == "__main__":
    print("🚀 Starting FocusAI Backend Server...")
    print("📍 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    if AI_ENABLED:
        print("🤖 AI: Claude 3.5 Sonnet (Enabled)")
    else:
        print("⚠️  AI: Using fallback responses (Set ANTHROPIC_API_KEY)")
    print("\n" + "="*50)
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)