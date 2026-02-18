from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

class StudentAuth(BaseModel):
    name: str
    email: str
    password: str

class StudentLogin(BaseModel):
    email: str
    password: str

class StudentOnboard(BaseModel):
    student_id: int
    department: str
    experience_level: str
    skills: List[str]
    interests: List[str]

class ChatResponse(BaseModel):
    response: str
    intent: str

class RoadmapRequest(BaseModel):
    project_title: str
    theme: str
    tech_stack: List[str]

class RoadmapStep(BaseModel):
    id: int
    title: str
    description: str
    x: int
    y: int

class RoadmapResponse(BaseModel):
    steps: List[RoadmapStep]
    svg_path: str

class DashboardStats(BaseModel):
    total_users: int
    active_hackathons: int
    teams_formed: int

class CreateTeamRequest(BaseModel):
    hackathon_id: int
    student_id: int
    team_name: str

class JoinTeamRequest(BaseModel):
    student_id: int
    team_code: str
