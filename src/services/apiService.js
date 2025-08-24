import { URL_BASE } from './apiConfig';

// Servicio para el consumo de la API
class ApiService {
  
  // Método para enviar consultas SQL al backend
  async enviarPrompt(prompt) {
    try {
      const response = await fetch(`${URL_BASE}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extraer la respuesta del LLM del formato: {"LLM": "respuesta"}
      const llmResponse = data.LLM || data.llm || '';
      
      return {
        success: true,
        content: llmResponse,
        originalData: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: 'Error al conectar con el servidor'
      };
    }
  }

  // Método para obtener el historial de conversaciones
  async obtenerHistorial() {
    try {
      const response = await fetch(`${URL_BASE}/api/history`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Alias para mantener compatibilidad
  async sendQuery(query) {
    return this.enviarPrompt(query);
  }

  // Alias para mantener compatibilidad
  async getHistory() {
    return this.obtenerHistorial();
  }
}

export default new ApiService();
