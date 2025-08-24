from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore 
from Config.dataBaseConfig import PineconeConfig

class databaseVectormodel (PineconeConfig):
    def __init__(self):
        self.pipecone = Pinecone(api_key=self.PINECONE_API_KEY)
        self.record = "taller"

    def agregarRecords(self, chunks: str):
        resultado = PineconeVectorStore.from_documents(
        chunks,
        embedding=self.Modelo,
        index_name=self.record)
        return resultado
    
    def eliminarRecords(self):
        index = self.pipecone.Index(self.record)
        index.delete(delete_all=True)
    
    def consultarRecords(self, pregunta: str):
        vstore = PineconeVectorStore.from_existing_index(index_name=self.record, embedding=self.Modelo)
        context = vstore.similarity_search(query=pregunta, k=20)
        return context