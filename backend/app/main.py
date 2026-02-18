from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    ChatRequest, ChatResponse, RoadmapRequest, RoadmapResponse, 
    DashboardStats, StudentAuth, StudentLogin, StudentOnboard,
    CreateTeamRequest, JoinTeamRequest
)
from .agents.router_agent import app_graph
from .database import get_db, Student, Hackathon
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

# Simple mock hashing for demo (in production use passlib/bcrypt)
def hash_password(password: str): return f"hashed_{password}"
def verify_password(hashed, plain): return hashed == f"hashed_{plain}"

@app.get("/")
async def root():
    return {"message": "HackAssist Neural Core Online"}

@app.post("/api/auth/register")
async def register(profile: StudentAuth, db = Depends(get_db)):
    # Check if email exists
    existing = db.query(Student).filter(Student.email == profile.email).first()
    if existing:
        return {"status": "error", "message": "Email already registered in Neural Core."}

    db_student = Student(
        name=profile.name,
        email=profile.email,
        password_hash=hash_password(profile.password)
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return {"status": "success", "student_id": db_student.student_id}

@app.post("/api/auth/login")
async def login(credentials: StudentLogin, db = Depends(get_db)):
    student = db.query(Student).filter(Student.email == credentials.email).first()
    if student and verify_password(student.password_hash, credentials.password):
        return {
            "status": "success", 
            "student_id": student.student_id,
            "name": student.name,
            "onboarded": bool(student.skills)
        }
    return {"status": "error", "message": "Invalid credentials"}

@app.post("/api/student/onboard")
async def onboard(data: StudentOnboard, db = Depends(get_db)):
    student = db.query(Student).filter(Student.student_id == data.student_id).first()
    if not student: return {"status": "error", "message": "Student not found"}
    
    student.department = data.department
    student.experience_level = data.experience_level
    student.skills = data.skills
    student.interests = data.interests
    db.commit()
    return {"status": "success"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Run the LangGraph agent
    student_id = int(request.user_id) if request.user_id and request.user_id.isdigit() else 1
    result = await app_graph.ainvoke({
        "messages": [HumanMessage(content=request.message)],
        "student_id": student_id
    })
    return ChatResponse(response=result["output"], intent=result["intent"])

@app.get("/api/recommendations/{student_id}")
async def get_personalized_recommendations_api(student_id: int):
    from .agents.specialist_agents import get_personalized_recommendations
    res = await get_personalized_recommendations(student_id)
    return res

@app.get("/api/hackathons")
async def list_hackathons(db = Depends(get_db)):
    from datetime import datetime
    # Fetch all hackathons that are still active or upcoming
    hacks = db.query(Hackathon).filter(Hackathon.deadline >= datetime.now()).all()
    return hacks

@app.get("/api/hackathon/{hackathon_id}")
async def get_hackathon_details(hackathon_id: str, db = Depends(get_db)):
    from urllib.parse import unquote
    # Try ID lookup if numeric
    if hackathon_id.isdigit():
        hack = db.query(Hackathon).filter(Hackathon.hackathon_id == int(hackathon_id)).first()
    else:
        # Fallback to name lookup
        decoded_name = unquote(hackathon_id)
        hack = db.query(Hackathon).filter(Hackathon.name == decoded_name).first()
    return hack

import random
import string

def generate_team_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.post("/api/team/create")
async def create_team(req: CreateTeamRequest, db = Depends(get_db)):
    from .database import Team, Participation
    
    # Generate unique code
    code = generate_team_code()
    while db.query(Team).filter(Team.team_code == code).first():
        code = generate_team_code()
        
    new_team = Team(
        hackathon_id=req.hackathon_id,
        team_name=req.team_name,
        team_code=code
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    
    # Create participation for the creator
    participation = Participation(
        student_id=req.student_id,
        hackathon_id=req.hackathon_id,
        team_id=new_team.team_id,
        role="Leader",
        status="Registered"
    )
    db.add(participation)
    db.commit()
    
    return {"status": "success", "team_code": code, "team_id": new_team.team_id}

@app.post("/api/team/join")
async def join_team(req: JoinTeamRequest, db = Depends(get_db)):
    from .database import Team, Participation
    
    team = db.query(Team).filter(Team.team_code == req.team_code).first()
    if not team:
        return {"status": "error", "message": "Invalid team code."}
        
    # Check if already in this hackathon
    existing = db.query(Participation).filter(
        Participation.student_id == req.student_id,
        Participation.hackathon_id == team.hackathon_id
    ).first()
    
    if existing:
        return {"status": "error", "message": "You are already registered for this hackathon."}
        
    participation = Participation(
        student_id=req.student_id,
        hackathon_id=team.hackathon_id,
        team_id=team.team_id,
        role="Member",
        status="Registered"
    )
    db.add(participation)
    db.commit()
    
    return {"status": "success", "team_name": team.team_name, "hackathon_id": team.hackathon_id}

@app.get("/api/team/members/{team_id}")
async def get_team_members(team_id: int, db = Depends(get_db)):
    from .database import Participation, Student
    members = db.query(Student).join(Participation).filter(Participation.team_id == team_id).all()
    return members

@app.get("/api/student_progress/{student_id}")
async def get_student_progress(student_id: int, db = Depends(get_db)):
    from .database import Participation, Hackathon
    results = db.query(Participation, Hackathon).join(Hackathon).filter(Participation.student_id == student_id).all()
    return [
        {"hackathon": h.name, "status": p.status, "deadline": h.deadline, "hackathon_id": h.hackathon_id}
        for p, h in results
    ]

@app.get("/api/analytics/department")
async def get_department_analytics_api():
    from .agents.specialist_agents import get_department_analytics
    report = await get_department_analytics()
    return {"report": report}

@app.post("/api/sync")
async def trigger_sync():
    """Triggers the live scraper and synchronization process."""
    try:
        from .sync_scraped_data import sync_data
        # This will run the sync logic (Scraping + SQL + RAG)
        # Note: In a production app, this should be a background task
        sync_data()
        return {"status": "success", "message": "Neural Core synchronized with live data peaks."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/team/check/{student_id}/{hackathon_id}")
async def check_team_membership(student_id: int, hackathon_id: str, db = Depends(get_db)):
    from .database import Participation, Team
    from urllib.parse import unquote
    
    # Resolve hackathon_id (numeric or name)
    actual_hid = None
    if hackathon_id.isdigit():
        actual_hid = int(hackathon_id)
    else:
        h_name = unquote(hackathon_id)
        hack = db.query(Hackathon).filter(Hackathon.name == h_name).first()
        if hack: actual_hid = hack.hackathon_id
        
    if not actual_hid:
        return {"status": "none"}
        
    participation = db.query(Participation).filter(
        Participation.student_id == student_id,
        Participation.hackathon_id == actual_hid
    ).first()
    
    if participation and participation.team_id:
        team = db.query(Team).filter(Team.team_id == participation.team_id).first()
        return {
            "status": "exists",
            "team_id": team.team_id,
            "team_name": team.team_name,
            "team_code": team.team_code
        }
    return {"status": "none"}

@app.post("/api/roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    from .agents.specialist_agents import get_hackathon_roadmap_agent
    # Try to generate semantic steps if we have IDs
    if request.user_id and request.hackathon_id:
        try:
            steps = await get_hackathon_roadmap_agent(int(request.user_id), int(request.hackathon_id))
            if steps:
                # Generate a simple path string for the SVG
                path = "M " + " L ".join([f"{s['x']} {s['y']}" for s in steps])
                return RoadmapResponse(steps=steps, svg_path=path)
        except Exception as e:
            print(f"Roadmap Agent Error: {e}")

    # Fallback to static if agent fails
    steps = [
        {"id": 1, "title": "Foundation", "description": "Setup project structure", "x": 100, "y": 100},
        {"id": 2, "title": "Core Dev", "description": "Implement main features", "x": 300, "y": 200},
        {"id": 3, "title": "Polishing", "description": "UI/UX enhancements", "x": 500, "y": 100}
    ]
    return RoadmapResponse(steps=steps, svg_path="M 100 100 L 300 200 L 500 100")

@app.get("/api/dashboard", response_model=DashboardStats)
async def get_dashboard():
    return DashboardStats(total_users=1240, active_hackathons=12, teams_formed=45)
