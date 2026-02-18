import json
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load .env from project root relative to this file
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(env_path)

from .database import SessionLocal, Hackathon, init_db
from .rag.rag_engine import rag_engine

def parse_deadline(deadline_str):
    """Simple parser for relative or absolute deadlines."""
    today = datetime.now()
    if "days left" in deadline_str:
        days = int(deadline_str.split()[0])
        return today + timedelta(days=days)
    if "Starts" in deadline_str:
        try:
            # Try to parse DD/MM/YY
            date_part = deadline_str.split()[-1]
            return datetime.strptime(date_part, "%d/%m/%y")
        except:
            return today + timedelta(days=30)
    return today + timedelta(days=14)

def sync_data():
    print("🚀 Starting Data Synchronization...")
    init_db()
    db = SessionLocal()
    
    data_path = os.path.join(os.path.dirname(__file__), "..", "scraped_data.json")
    with open(data_path, "r") as f:
        data = json.load(f)
    
    all_hackathons = data.get("unstop", []) + data.get("devfolio", [])
    
    # 1. Update SQL Database
    added_count = 0
    for item in all_hackathons:
        # Check if exists
        exists = db.query(Hackathon).filter(Hackathon.name == item["name"]).first()
        if not exists:
            h = Hackathon(
                name=item["name"],
                description=item["description"],
                skills_required=item["skills"],
                deadline=parse_deadline(item["deadline"])
            )
            db.add(h)
            added_count += 1
    
    db.commit()
    print(f"✅ SQL Update Complete: {added_count} new hackathons added.")

    # 2. Update RAG Engine
    print("🧠 Updating RAG Vector Store...")
    try:
        # Prepare documents for RAG
        documents = []
        for item in all_hackathons:
            content = f"Hackathon: {item['name']}\nDescription: {item['description']}\nRequired Skills: {', '.join(item['skills'])}\nStatus: {item['deadline']}"
            documents.append(content)
        
        # Re-index everything (simplified for demo)
        rag_engine.add_documents(documents)
        print("✨ RAG Metadata Re-indexed Successfully.")
    except Exception as e:
        print(f"⚠️ RAG Update Skipped: {e}")
        print("Please ensure your GEMINI_API_KEY is valid in .env to use RAG features.")
    
    db.close()
    print("🏁 Sync Finished.")

if __name__ == "__main__":
    sync_data()
