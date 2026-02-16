import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from .specialist_agents import recommendation_agent, team_formation_agent, idea_gen_agent
from ..rag.rag_engine import rag_engine
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage

# Define State
class AgentState(TypedDict):
    messages: List[BaseMessage]
    student_id: int
    intent: str
    context: str
    output: str

# Router logic
def router_node(state: AgentState):
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
    query = state["messages"][-1].content
    
    # Simple classification prompt
    prompt = f"Classify this hackathon query: RECOMMENDATION, TEAM_MATCHING, IDEA_GEN, ANALYTICS. Query: {query}"
    intent = llm.invoke(prompt).content.strip().upper()
    
    # RAG lookup for context
    context = rag_engine.query(query)
    context_text = "\n".join([doc.page_content for doc in context])
    
    return {"intent": intent, "context": context_text}

# Node for Specialists
async def execute_task(state: AgentState):
    from .specialist_agents import get_recommendations, get_team_suggestions, idea_gen_agent, get_department_analytics
    
    query = state["messages"][-1].content
    intent = state["intent"]
    student_id = state.get("student_id", 1) # Default to 1 for demo
    
    if "RECOMMENDATION" in intent:
        res = await get_recommendations(student_id, state["context"])
    elif "TEAM" in intent:
        res = await get_team_suggestions(student_id)
    elif "ANALYTICS" in intent:
        res = await get_department_analytics()
    else:
        res = await idea_gen_agent.ainvoke({"theme": query, "tech_stack": "React, Python"})
    
    return {"output": res}

# Build Graph
workflow = StateGraph(AgentState)
workflow.add_node("router", router_node)
workflow.add_node("executor", execute_task)

workflow.set_entry_point("router")
workflow.add_edge("router", "executor")
workflow.add_edge("executor", END)

app_graph = workflow.compile()
