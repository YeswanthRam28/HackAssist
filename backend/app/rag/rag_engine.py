import os
from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

class RAGEngine:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=os.getenv("GEMINI_API_KEY")
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.persist_directory = "./chroma_db"
        self.vector_store = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embeddings
        )

    def ingest_text(self, text: str, metadata: dict = None):
        """Chunks and ingests raw text into the vector store."""
        chunks = self.text_splitter.split_text(text)
        docs = [Document(page_content=chunk, metadata=metadata or {}) for chunk in chunks]
        self.vector_store.add_documents(docs)
        self.vector_store.persist()

    def query(self, query: str, k: int = 3) -> List[Document]:
        """Performs a similarity search in the vector store."""
        return self.vector_store.similarity_search(query, k=k)

# Global engine instance
rag_engine = RAGEngine()
