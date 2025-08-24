import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles/App.css';

// Importación de componentes (capa de diseño y vistas)
import {
  Header,
  HistorySidebar,
  MenuSidebar,
  ChatContainer,
  Modal,
  Footer
} from './components';

// Importación de hooks y servicios (capa de consumo de API y lógica)
import { useMessages, useHistory } from './services';

function App() {
  // Estados locales para la UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  
  // Referencias para el manejo de clicks fuera de los menús
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const historyRef = useRef(null);
  const historyButtonRef = useRef(null);

  // Hooks para la lógica de negocio
  const { messages, addMessage, sendQuery, loadMessagesFromConversation } = useMessages();
  const { 
    history, 
    currentConversationId, 
    loadHistory, 
    createNewConversation, 
    deleteConversation, 
    updateConversation, 
    selectConversation 
  } = useHistory();

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const toggleHistory = useCallback(() => {
    setHistoryOpen(prev => !prev);
  }, []);

  const openModal = useCallback((msg) => {
    if (msg && msg.content) {
      setModalMessage(msg);
      setModalOpen(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalMessage(null);
  }, []);

  const handleCopy = useCallback((code) => {
    try {
      if (code) {
        navigator.clipboard.writeText(code);
      } else if (modalMessage && modalMessage.content) {
        // Fallback para extraer código del mensaje completo
        const codeMatch = modalMessage.content.match(/```sql([\s\S]*?)```/);
        const extractedCode = codeMatch ? codeMatch[1].trim() : modalMessage.content;
        navigator.clipboard.writeText(extractedCode);
      }
    } catch (error) {
      // Error silenciado
    }
  }, [modalMessage]);

  // Cargar historial al iniciar
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Actualizar conversación actual cuando cambien los mensajes
  // Usamos useRef para evitar actualizaciones excesivas
  const messagesRef = useRef();
  messagesRef.current = messages;
  
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      // Usar setTimeout para debounce y evitar actualizaciones excesivas
      const timeoutId = setTimeout(() => {
        updateConversation(currentConversationId, messagesRef.current);
      }, 300); // 300ms de debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentConversationId, messages.length]); // ❌ Removida updateConversation de dependencias

  // Manejar creación de nueva conversación
  const handleCreateNewConversation = useCallback(() => {
    createNewConversation();
    loadMessagesFromConversation({ messages: [] }); // Limpiar mensajes actuales
  }, [createNewConversation, loadMessagesFromConversation]);

  // Manejar selección de conversación
  const handleSelectConversation = useCallback((conversationId) => {
    const conversation = history.find(conv => conv.id === conversationId);
    if (conversation) {
      selectConversation(conversationId);
      loadMessagesFromConversation(conversation);
    }
  }, [history, selectConversation, loadMessagesFromConversation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target) &&
        historyButtonRef.current &&
        !historyButtonRef.current.contains(event.target)
      ) {
        setHistoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <Header 
        onToggleMenu={toggleMenu}
        onToggleHistory={toggleHistory}
        menuButtonRef={menuButtonRef}
        historyButtonRef={historyButtonRef}
      />
      
      <HistorySidebar 
        isOpen={historyOpen}
        onToggle={toggleHistory}
        historyRef={historyRef}
        history={history}
        currentConversationId={currentConversationId}
        onCreateNew={handleCreateNewConversation}
        onDeleteConversation={deleteConversation}
        onSelectConversation={handleSelectConversation}
      />
      
      <MenuSidebar 
        isOpen={menuOpen}
        onToggle={toggleMenu}
        menuRef={menuRef}
      />
      
      <main className="App-main">
        <ChatContainer 
          messages={messages}
          onOpenModal={openModal}
        />
        
        <Modal 
          isOpen={modalOpen}
          message={modalMessage}
          onClose={closeModal}
          onCopy={handleCopy}
        />
      </main>
      
      <Footer onSendQuery={sendQuery} />
    </div>
  );
}

export default App;
