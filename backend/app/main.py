from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ChatRequest, ChatResponse, RoadmapRequest, RoadmapResponse, DashboardStats
from .agents.router_agent import app_graph
from langchain_core.messages import HumanMessage

app = FastAPI(title="HackAssist API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "HackAssist Neural Core Online"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Run the LangGraph agent
    student_id = int(request.user_id) if request.user_id and request.user_id.isdigit() else 1
    result = await app_graph.ainvoke({
        "messages": [HumanMessage(content=request.message)],
        "student_id": student_id
    })
    return ChatResponse(response=result["output"], intent=result["intent"])

@app.post("/api/register_hackathon")
async def register_hackathon(request: ChatRequest, db = Depends(get_db)):
    # Simple registration logic (message field repurposed for hackathon_id in this demo body)
    from .database import Participation
    hackathon_id = int(request.message)
    student_id = int(request.user_id) if request.user_id and request.user_id.isdigit() else 1
    
    participation = Participation(
        student_id=student_id,
        hackathon_id=hackathon_id,
        status="Registered",
        team_name="TBD"
    )
    db.add(participation)
    db.commit()
    return {"status": "success", "message": f"Registered for hackathon {hackathon_id}"}

@app.get("/api/student_progress/{student_id}")
async def get_student_progress(student_id: int, db = Depends(get_db)):
    from .database import Participation, Hackathon
    results = db.query(Participation, Hackathon).join(Hackathon).filter(Participation.student_id == student_id).all()
    return [
        {"hackathon": h.name, "status": p.status, "deadline": h.deadline}
        for p, h in results
    ]

@app.get("/api/analytics/department")
async def get_department_analytics_api():
    from .agents.specialist_agents import get_department_analytics
    report = await get_department_analytics()
    return {"report": report}

@app.post("/api/roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    # This would typically use an agent to generate steps
    # Placeholder implementation
    steps = [
        {"id": 1, "title": "Foundation", "description": "Setup project structure", "x": 100, "y": 100},
        {"id": 2, "title": "Core Dev", "description": "Implement main features", "x": 300, "y": 200},
        {"id": 3, "title": "Polishing", "description": "UI/UX enhancements", "x": 500, "y": 100}
    ]
    return RoadmapResponse(steps=steps, svg_path="M 100 100 L 300 200 L 500 100")

@app.get("/api/dashboard", response_model=DashboardStats)
async def get_dashboard():
    return DashboardStats(total_users=1240, active_hackathons=12, teams_formed=45)
