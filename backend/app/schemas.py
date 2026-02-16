from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

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
