from datetime import datetime, timedelta
from database import SessionLocal, init_db, Student, Hackathon

def seed():
    init_db()
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Student).first():
        print("Database already seeded.")
        return

    # Seed Students
    students = [
        Student(
            name="Yeswanth Ram",
            department="CSE",
            skills=["Python", "React", "AI"],
            interests=["Generative AI", "Web Development"]
        ),
        Student(
            name="John Doe",
            department="IT",
            skills=["Java", "Spring Boot", "SQL"],
            interests=["Backend Systems"]
        ),
        Student(
            name="Alice Smith",
            department="ECE",
            skills=["C++", "Embedded Systems"],
            interests=["Robotics", "IoT"]
        )
    ]
    db.add_all(students)

    # Seed Hackathons
    hackathons = [
        Hackathon(
            name="AI Innovation Challenge",
            description="Build the next generation of AI tools.",
            skills_required=["Python", "LLM", "React"],
            deadline=datetime.now() + timedelta(days=30)
        ),
        Hackathon(
            name="FinTech Future",
            description="Revolutionize the financial world with code.",
            skills_required=["Java", "Blockchain", "Solidity"],
            deadline=datetime.now() + timedelta(days=45)
        ),
        Hackathon(
            name="Green IoT Hack",
            description="Sustainable solutions using Internet of Things.",
            skills_required=["C++", "Arduino", "IoT"],
            deadline=datetime.now() + timedelta(days=15)
        )
    ]
    db.add_all(hackathons)
    
    db.commit()
    db.close()
    print("Database seeded successfully.")

if __name__ == "__main__":
    seed()
