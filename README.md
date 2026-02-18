# HackAssist v2.5: Full-Stack AI Hackathon Agent

HackAssist is a comprehensive, industry-grade AI platform designed to empower students, faculty, and HODs throughout the hackathon lifecycle. It transitions from a cinematic storytelling experience into a functional AI command center.

## 🚀 Recent Innovation (v2.5)

### **1. The Hackathon Wall (Student Dashboard)**
- **High-Density Grid**: A new 3-column "Wall" for students to browse live opportunities with zero friction.
- **Hybrid AI Recommendations**: Matches your skills (SQL) with hackathon metadata (RAG) for perfect event discovery.
- **Interactive Registration**: One-click AI buttons to register and track participation in real-time.

### **2. Intelligence Mission Hub**
- **Real-Time Scraping**: Automated browser engine extracts the latest events from **Unstop** and **Devfolio**.
- **On-Demand Sync**: Administrators (HOD) can trigger a global refresh of the neural core and relational database with one click.
- **Stable Intelligence**: Re-architected with **Gemini 1.5 Flash** for 100% uptime and bypassable quotas.

### **3. Institutional Command**
- **Faculty Dashboard**: Monitor class-wide participation, top performers, and innovation trends.
- **HOD Strategic Overview**: Macro-level analytics on departmental growth.
- **Cloud Scale**: Fully integrated with **Neon PostgreSQL** (Serverless Cloud) for production-grade reliability.

## 🛠️ Technical Stack

- **Frontend**: React 19 + Vite + GSAP + Three.js + Framer Motion + Tailwind CSS.
- **Backend**: FastAPI + LangChain + LangGraph + Google Gemini 1.5 + SQLAlchemy.
- **Data Layers**: Neon Cloud PostgreSQL (Relational) + ChromaDB (Vector Search).

## 📦 Setup & Installation

### **1. Backend Configuration**
```bash
cd backend
python -m venv venv
source venv/bin/Scripts/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
- Create a `.env` in the root with:
```env
GEMINI_API_KEY=your_key_here
DATABASE_URL=postgresql://user:pass@host/dbname # Or sqlite for local
```
- Sync live data (triggers scraper + RAG index):
```bash
$env:PYTHONPATH="." 
python -m app.sync_scraped_data
```
- Start the API:
```bash
uvicorn app.main:app --reload
```

### **2. Frontend Configuration**
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture

- **Neural RAG**: Uses `gemini-embedding-001` to vectorize scraped event descriptions for semantic matching.
- **Persona-Based UI**: Conditional rendering ensures Students see missions, while HODs see departmental health.

---
Developed for the **Advanced Engineering Collective** • 2026
