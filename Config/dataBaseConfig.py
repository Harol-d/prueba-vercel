from dataclasses import dataclass
from typing import Optional
from langchain_huggingface import HuggingFaceEmbeddings
import os
import dotenv

dotenv.load_dotenv("../.env")

@dataclass
class PineconeConfig:
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    Modelo = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={
            'normalize_embeddings': True
        }
    )
    
    