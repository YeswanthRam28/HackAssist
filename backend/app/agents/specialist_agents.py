import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from ..database import SessionLocal, Student, Hackathon, Participation

# Load .env from project root relative to this file
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(env_path)

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# 1. Hackathon Recommendation Agent
recommendation_prompt = ChatPromptTemplate.from_template("""
You are a Hackathon Recommendation Agent.
Recommend the top 3 hackathons based on student skills, interests, and experience level.

Student Profile: {profile}
Active Hackathons from DB: {hackathons}

Output MUST be a valid JSON array of objects with these keys: 
"hackathon_id", "name", "description", "match_score" (0-100), "reason" (brief explanation).
Example: [{{"hackathon_id": 1, "name": "AI Hack", "description": "...", "match_score": 95, "reason": "Matches your Python skills"}}]
ONLY return the JSON.
""")

async def get_personalized_recommendations(student_id: int):
    try:
        db = SessionLocal()
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            return []
            
        hackathons = db.query(Hackathon).all()
        
        profile_str = f"Skills: {student.skills}, Interests: {student.interests}, Experience: {student.experience_level}"
        hacks_str = "\n".join([f"- ID: {h.hackathon_id}, Name: {h.name}: {h.description} (Skills Required: {h.skills_required})" for h in hackathons])
        
        chain = recommendation_prompt | llm | StrOutputParser()
        res = await chain.ainvoke({"profile": profile_str, "hackathons": hacks_str})
        
        import json
        clean_res = res.strip(" `").replace("json\n", "")
        recs = json.loads(clean_res)
        
        # Post-process to ensure valid hackathon_id (AI sometimes uses names)
        final_recs = []
        for rec in recs:
            # If ID is missing or not numeric, try to find it by name
            valid_id = None
            try:
                valid_id = int(rec.get("hackathon_id"))
            except (ValueError, TypeError):
                # Look up by name if ID is invalid
                h_name = rec.get("name")
                h_obj = next((h for h in hackathons if h.name.lower() == h_name.lower()), None)
                if h_obj:
                    valid_id = h_obj.hackathon_id
            
            if valid_id:
                rec["hackathon_id"] = valid_id
                final_recs.append(rec)
        
        db.close()
        return final_recs
    except Exception as e:
        print(f"AI Recommendation Failed: {str(e)}")
        # Fallback to simple hackathon list if AI fail (quota etc)
        db = SessionLocal()
        hacks = db.query(Hackathon).limit(3).all()
        db.close()
        return [{"hackathon_id": h.hackathon_id, "name": h.name, "description": h.description, "match_score": 0, "reason": "AI Recommendation temporarily unavailable (Quota Reach)"} for h in hacks]

async def get_recommendations_text(student_id: int, context: str):
    # Existing text-based version for chat
    db = SessionLocal()
    student = db.query(Student).filter(Student.student_id == student_id).first()
    hackathons = db.query(Hackathon).all()
    
    profile_str = f"Name: {student.name}, Skills: {student.skills}, Department: {student.department}, Interests: {student.interests}, Experience Level: {student.experience_level}"
    hacks_str = "\n".join([f"- {h.name}: {h.description} (Skills: {h.skills_required}, Deadline: {h.deadline})" for h in hackathons])
    
    prompt = ChatPromptTemplate.from_template("""
    You are a Hackathon Recommendation Agent.
    Recommend hackathons based on student profile.
    
    Student Profile: {profile}
    Active Hackathons: {hackathons}
    Context: {context}
    
    Provide helpful text-based recommendations.
    """)
    
    chain = prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"profile": profile_str, "hackathons": hacks_str, "context": context})
    db.close()
    return res

# 2. Team Formation Agent
team_formation_prompt = ChatPromptTemplate.from_template("""
You are a Team Formation Agent. Suggest teams based on complementary skills.
Match the user with collaborators who fill their skill gaps.

User: {user}
Potential Collaborators: {pool}

Output format:
Team Suggestion:
[User Name] – [Core Skill]
[Collaborator 1 Name] – [Matching Skill]
[Collaborator 2 Name] – [Matching Skill]

Explain the logic of this team composition.
""")

async def get_team_suggestions(student_id: int):
    db = SessionLocal()
    user = db.query(Student).filter(Student.student_id == student_id).first()
    others = db.query(Student).filter(Student.student_id != student_id).all()
    
    user_str = f"{user.name} (Skills: {user.skills}, Experience: {user.experience_level})"
    pool_str = "\n".join([f"- {s.name} (Skills: {s.skills}, Experience: {s.experience_level})" for s in others])
    
    chain = team_formation_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"user": user_str, "pool": pool_str})
    db.close()
    return res

# 3. Hackathon Idea Generation Agent
idea_gen_prompt = ChatPromptTemplate.from_template("""
You are a Creative Hackathon Idea Generator. 
The student wants to build something innovative.

Requested Theme: {theme}
Student Tech Stack: {tech_stack}

Generate 3 unique and viable project ideas.
Output format:
1. [Project Name] - [Description]
2. [Project Name] - [Description]
3. [Project Name] - [Description]
""")

async def get_hackathon_ideas(theme: str, tech_stack: str):
    chain = idea_gen_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({"theme": theme, "tech_stack": tech_stack})
    return res

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
# 5. Strategic Roadmap Agent
roadmap_agent_prompt = ChatPromptTemplate.from_template("""
You are a Strategic Hackathon Roadmap Designer for HackAssist.
Generate a strictly structured 5-step roadmap for a student participating in a specific hackathon.
The roadmap must be tailored to the hackathon's theme and the student's skills.

Student Skills: {skills}
Hackathon: {hack_name}
Mission Objective: {hack_description}
Required Skills: {required_skills}

Output MUST be a valid JSON array of 5 objects with these exact keys:
"id" (1-5), "title" (short), "description" (brief actionable step), "x" (coordinate for visualization 100-700), "y" (coordinate 50-300).

Example: [{{"id": 1, "title": "Initialization", "description": "Set up the repo with React and FastAPI.", "x": 100, "y": 150}}]
ONLY return the JSON.
""")

async def get_hackathon_roadmap_agent(student_id: int, hackathon_id: int):
    db = SessionLocal()
    student = db.query(Student).filter(Student.student_id == student_id).first()
    hack = db.query(Hackathon).filter(Hackathon.hackathon_id == hackathon_id).first()
    
    if not student or not hack:
        db.close()
        return []

    skills_str = ", ".join(student.skills) if student.skills else "Not specified"
    req_skills_str = ", ".join(hack.skills_required) if hack.skills_required else "General"
    
    chain = roadmap_agent_prompt | llm | StrOutputParser()
    res = await chain.ainvoke({
        "skills": skills_str,
        "hack_name": hack.name,
        "hack_description": hack.description,
        "required_skills": req_skills_str
    })
    
    import json
    try:
        clean_res = res.strip(" `").replace("json\n", "")
        steps = json.loads(clean_res)
    except:
        # Fallback basic steps
        steps = [
            {"id": 1, "title": "Research", "description": "Analyze hackathon theme", "x": 100, "y": 150},
            {"id": 2, "title": "Prototype", "description": "Build core MVP", "x": 250, "y": 250},
            {"id": 3, "title": "Refine", "description": "Add advanced features", "x": 400, "y": 150},
            {"id": 4, "title": "Test", "description": "Final verification", "x": 550, "y": 250},
            {"id": 5, "title": "Deploy", "description": "Submit to judges", "x": 700, "y": 150}
        ]
    
    db.close()
    return steps
