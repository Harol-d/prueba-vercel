import { useState, useCallback, useEffect, useRef } from 'react';
import apiService from '../services/apiService';

// Hook para manejar la lógica de los mensajes del chat
export const useMessages = () => {
  const [messages, setMessages] = useState([]);

  // Función para generar IDs únicos
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendQuery = async (query) => {
    // Validación adicional
    if (!query || !query.trim()) {
      return;
    }
    
    try {
      // Agregar mensaje del usuario
      const userMessage = {
        id: generateUniqueId(),
        type: 'user',
        content: query,
        time: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        full: false
      };
      
      addMessage(userMessage);
  
      // Enviar consulta al backend
      const response = await apiService.enviarPrompt(query);
      
      if (!response.success) {
        throw new Error(response.error || 'Error desconocido');
      }
      const loadingMessage = {
        id: generateUniqueId(),
        type: 'system',
        content: response.content,
        time: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        full: false,
        isLoading: true
      };
      
      addMessage(loadingMessage);
      // Remover el mensaje de carga y agregar la respuesta real con animación
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      const systemMessage = {
        id: generateUniqueId(),
        type: 'system',
        content: response.content || 'Respuesta recibida',
        time: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        full: false,
        isTyping: true,  // Solo mensajes nuevos tienen animación
        isNewMessage: true,  // Marcar como mensaje nuevo para optimización
        displayedContent: ''
      };
      
      addMessage(systemMessage);
      
      return response;
    } catch (error) {
      // Remover mensaje de carga si existe
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Agregar mensaje de error
      const errorMessage = {
        id: generateUniqueId(),
        type: 'system',
        content: `Error al enviar la consulta: ${error.message}`,
        time: new Date().toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        full: false
      };
      
      addMessage(errorMessage);
      throw error;
    }
  };

  // Nueva función para cargar mensajes desde una conversación
  const loadMessagesFromConversation = (conversation) => {
    console.log('🔄 Loading messages from conversation:', conversation);
    console.log('📝 Raw messages:', conversation.messages);
    
    // Limpiar estados de animación de mensajes históricos para evitar 
    // que se ejecuten múltiples animaciones simultáneamente
    const cleanMessages = (conversation.messages || []).map(msg => {
      console.log('🧹 Cleaning message:', msg);
      return {
        ...msg,
        isTyping: false,  // Desactivar animación en mensajes históricos
        isLoading: false,  // Limpiar estado de carga
        isHistorical: true  // Marcar como mensaje histórico
      };
    });
    
    console.log('✅ Clean messages to set:', cleanMessages);
    setMessages(cleanMessages);
  };

  return {
    messages,
    setMessages,
    addMessage,
    sendQuery,
    loadMessagesFromConversation
  };
};

// Hook para manejar el historial con sessionStorage
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const initialConversationCreated = useRef(false);

  // Cargar historial desde sessionStorage
  const loadHistory = useCallback(() => {
    try {
      const historyData = JSON.parse(sessionStorage.getItem('chatHistory') || '[]');
      setHistory(historyData);
      
      // Si no hay conversación actual y hay historial, seleccionar el primero
      if (!currentConversationId && historyData.length > 0) {
        setCurrentConversationId(historyData[0].id);
      }
    } catch (error) {
      setHistory([]);
    }
  }, []); // ❌ Removida la dependencia problemática

  // Guardar historial en sessionStorage
  const saveHistory = (newHistory) => {
    sessionStorage.setItem('chatHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  // Crear nueva conversación
  const createNewConversation = useCallback(() => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      title: `Conversación ${history.length + 1}`,
      snippet: 'Nueva conversación...',
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    const newHistory = [newConversation, ...history];
    saveHistory(newHistory);
    setCurrentConversationId(newConversation.id);
    return newConversation.id;
  }, [history]);

  // Eliminar conversación
  const deleteConversation = useCallback((conversationId) => {
    const newHistory = history.filter(conv => conv.id !== conversationId);
    saveHistory(newHistory);
    
    // Si eliminamos la conversación actual, crear una nueva
    if (currentConversationId === conversationId) {
      if (newHistory.length > 0) {
        setCurrentConversationId(newHistory[0].id);
      } else {
        createNewConversation();
      }
    }
  }, [history, currentConversationId, createNewConversation]);

  // Actualizar conversación con mensajes
  const updateConversation = useCallback((conversationId, messages) => {
    const newHistory = history.map(conv => {
      if (conv.id === conversationId) {
        const lastUserMessage = messages.filter(msg => msg.type === 'user').pop();
        return {
          ...conv,
          messages: messages,
          title: lastUserMessage ? 
            (lastUserMessage.content.length > 30 ? 
              `${lastUserMessage.content.substring(0, 30)}...` : 
              lastUserMessage.content) : 
            conv.title,
          snippet: lastUserMessage ? lastUserMessage.content : 'Sin mensajes',
          updatedAt: new Date().toISOString()
        };
      }
      return conv;
    });
    saveHistory(newHistory);
  }, [history]);

  // Seleccionar conversación
  const selectConversation = useCallback((conversationId) => {
    setCurrentConversationId(conversationId);
  }, []);

  // Crear conversación automáticamente si no hay ninguna
  useEffect(() => {
    if (history.length === 0 && !initialConversationCreated.current) {
      initialConversationCreated.current = true;
      createNewConversation();
    }
  }, [history.length, createNewConversation]);

  return {
    history,
    currentConversationId,
    loadHistory,
    createNewConversation,
    deleteConversation,
    updateConversation,
    selectConversation
  };
};
