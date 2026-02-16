# HackAssist v2.5: Full-Stack AI Hackathon Agent

HackAssist is a comprehensive, industry-grade AI platform designed to empower students, faculty, and HODs throughout the hackathon lifecycle. It transitions from a cinematic storytelling experience into a functional AI command center.

## 🚀 Features

### **1. Student Command Center**
- **Hybrid AI Recommendations**: Matches your skills (SQL) with hackathon metadata (RAG) for perfect event discovery.
- **One-Click Registration**: Interactive AI buttons to register and track participation in real-time.
- **Progress Tracking**: Holistic overview of your innovation journey (Registered → Submitted → Won/Lost).
- **Roadmap Generation**: Personalized preparation steps for any hackathon theme.

### **2. Departmental Intelligence**
- **Faculty Dashboard**: Monitor class-wide participation, top performers, and innovation trends.
- **HOD Strategic Overview**: Macro-level analytics on department-wide technological growth and engagement.
- **AI Innovation Reports**: Automated executive summaries of student activity.

## 🛠️ Technical Stack

- **Frontend**: React 19, Vite, GSAP (Animations), Three.js (Neural Core), Framer Motion, Tailwind CSS, Zustand, React Router.
- **Backend**: FastAPI (Python), LangChain, LangGraph (Stateful Agents), Google Gemini 1.5 Pro/Flash, SQLAlchemy (PostgreSQL/SQLite), ChromaDB (Vector Store).

## 📦 Setup & Installation

### **Prerequisites**
- Node.js (v18+)
- Python (3.10+)
- Gemini API Key

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
DATABASE_URL=sqlite:///./hackassist.db
```
- Seed the database:
```bash
python app/seed_db.py
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

- **Monorepo Structure**: Fully decoupled frontend and backend.
- **Hybrid Data Layer**: SQL for structured participation tracking + Vector DB (RAG) for expert knowledge retrieval.
- **Persona-Based UI**: Conditional rendering based on user roles (Student/Faculty/HOD).

---
Developed for the **Advanced Engineering Collective** • 2025
