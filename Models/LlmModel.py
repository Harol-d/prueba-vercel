# from langchain_core.messages import HumanMessage,SystemMessage
from Config.LlmConfig import SettingsLlm
from Models.ModelFactory import factoryLlm
# from langchain.chains.question_answering import load_qa_chain # Obsoleto
#from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

class ModeLlm (SettingsLlm):
    def __init__(self):
        self.factory = factoryLlm()
        self.model = self.factory.getLlm(
            self.LLM_PROVEEDOR,
            self.LLM_MODEL,
            self.API_KEY,
            self.temperature
        )

    def sendPrompt(self, prompt: str, context: str):
        # 1. Define la plantilla del prompt para instruir al modelo sobre cómo usar el contexto.
        prompt_template = ChatPromptTemplate.from_template(
            self.modelRole + "\n\n" +
            "You must respond guided only by the following context: {context}\n\n" +
            "User Question: {input}"
        )
        document_chain = create_stuff_documents_chain(self.model, prompt_template)
        response = document_chain.invoke({
            "input": prompt,
            "context": context
        })
        return response
        
