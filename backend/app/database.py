import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load .env from project root relative to this file
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(env_path)

# Database URL should be provided in .env
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Fallback only for extreme disaster recovery
    DATABASE_URL = "sqlite:///./hackassist.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    department = Column(String)
    experience_level = Column(String)  # Beginner, Intermediate, Expert
    skills = Column(JSON)  # List of strings
    interests = Column(JSON)  # List of strings
    
    participations = relationship("Participation", back_populates="student")
    ideas = relationship("Idea", back_populates="student")

class Hackathon(Base):
    __tablename__ = "hackathons"
    hackathon_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    skills_required = Column(JSON)  # List of strings
    deadline = Column(DateTime)
    
    participations = relationship("Participation", back_populates="hackathon")

class Team(Base):
    __tablename__ = "teams"
    team_id = Column(Integer, primary_key=True, index=True)
    hackathon_id = Column(Integer, ForeignKey("hackathons.hackathon_id"))
    team_name = Column(String)
    team_code = Column(String, unique=True, index=True)  # Random unique code
    created_at = Column(DateTime, default=datetime.utcnow)

    participations = relationship("Participation", back_populates="team")

class Participation(Base):
    __tablename__ = "participation"
    participation_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    hackathon_id = Column(Integer, ForeignKey("hackathons.hackathon_id"))
    team_id = Column(Integer, ForeignKey("teams.team_id"), nullable=True)
    role = Column(String)
    status = Column(String)  # Registered, In Progress, Submitted, Won, Lost
    result = Column(String, nullable=True)
    
    student = relationship("Student", back_populates="participations")
    hackathon = relationship("Hackathon", back_populates="participations")
    team = relationship("Team", back_populates="participations")

class Idea(Base):
    __tablename__ = "ideas"
    idea_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    idea_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="ideas")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)
