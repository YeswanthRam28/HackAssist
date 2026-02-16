import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from .database import SessionLocal, Student, Hackathon, Participation

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# 1. Hybrid Recommendation Agent
recommendation_prompt = ChatPromptTemplate.from_template("""
You are a Hackathon Recommendation Agent. 
Match the student's background with available hackathons from our database.

Student Profile: {profile}
Active Hackathons from DB: {hackathons}
Relevant Knowledge from RAG: {context}

Recommend the top 2-3 hackathons. Explain why they are a good fit based on the skills required.
""")

async def get_recommendations(student_id: int, context: str):
    db = SessionLocal()
    student = db.query(Student).filter(Student.student_id == student_id).first()
    hackathons = db.query(Hackathon).all()
    
    profile_str = f"Name: {student.name}, Skills: {student.skills}, Interests: {student.interests}"
    hacks_str = "\n".join([f"- {h.name}: {h.description} (Skills: {h.skills_required})" for h in hackathons])
    
    chain = recommendation_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"profile": profile_str, "hackathons": hacks_str, "context": context})
    db.close()
    return res

# 2. Skill-based Team Formation Agent
team_formation_prompt = ChatPromptTemplate.from_template("""
You are a Team Formation Agent. Match the current user with complementary collaborators.

User: {user}
Potential Collaborators: {pool}

Suggest 1-2 matches. Focus on how their skills fill the user's gaps.
""")

async def get_team_suggestions(student_id: int):
    db = SessionLocal()
    user = db.query(Student).filter(Student.student_id == student_id).first()
    others = db.query(Student).filter(Student.student_id != student_id).all()
    
    user_str = f"{user.name} (Skills: {user.skills})"
    pool_str = "\n".join([f"- {s.name} (Skills: {s.skills})" for s in others])
    
    chain = team_formation_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"user": user_str, "pool": pool_str})
    db.close()
    return res

# 3. Idea Generation Agent (Remains creative-focused)
idea_gen_prompt = ChatPromptTemplate.from_template("""
You are a Creative Hackathon Idea Generator. 
Theme: {theme}
Tech Stack preference: {tech_stack}

Generate 3 unique project ideas.
""")

idea_gen_agent = idea_gen_prompt | llm | StrOutputParser()

# 4. Analytics Agent (New)
analytics_prompt = ChatPromptTemplate.from_template("""
You are a Departmental Innovation Analyst. 
Analyze the current participation data and provide a concise innovation summary.

Data: {data}

Provide:
1. Participation Rate
2. Top Trending Skills
3. Innovation Score (0-100) based on project complexity.
""")

async def get_department_analytics():
    db = SessionLocal()
    # Simplified aggregate for demo
    total_students = db.query(Student).count()
    total_participations = db.query(Participation).count()
    
    data_summary = f"Total Students: {total_students}, Total Participations: {total_participations}"
    
    chain = analytics_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"data": data_summary})
    db.close()
    return res
