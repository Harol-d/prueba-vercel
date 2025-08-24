import React, { memo } from 'react';
import TypingAnimation from './TypingAnimation';

const ChatBubble = memo(({ message, onOpenModal }) => {
  const { id, type, content, time, isLoading, isTyping } = message;

  // Componente de loading para mensajes del sistema
  const LoadingDots = () => (
    <div className="loading-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  );

  // Función para renderizar contenido con formato SQL
  const renderContent = (content, isTyping = false) => {
    if (!content) return '';
    
    if (content.split('```sql').length > 1) {
      const parts = content.split('```sql');
      const beforeSQL = parts[0];
      const sqlPart = parts[1].replace('```', '').trim();
      
      return (
        <>
          {beforeSQL.split('\n').map((line, i) => <div key={i}>{line}</div>)}
          <pre className="sql-block">{sqlPart}</pre>
        </>
      );
    }
    
    // Solo mostrar animación de escritura para mensajes nuevos que están marcados como typing
    // y que no son históricos
    if (isTyping && !message.isHistorical) {
      return <TypingAnimation fullText={content} typingSpeed={8} />;
    }
    
    // Para mensajes históricos o completados, mostrar el contenido directamente
    return content;
  };

  // Función para manejar el click del modal
  const handleModalClick = () => {
    // Solo permitir abrir modal si:
    // 1. Es mensaje del sistema
    // 2. No está cargando
    // 3. No está escribiendo
    // 4. Tiene contenido
    // 5. Contiene SQL
    if (type === 'system' && !isLoading && !isTyping && content && content.includes('```sql')) {
      onOpenModal(message);
    }
  };

  return (
    <div
      key={id}
      className={`chat-bubble ${type} ${isLoading ? 'loading' : ''} ${isTyping ? 'typing' : ''}`}
      onClick={handleModalClick}
      style={
        type === 'system' && 
        !isLoading && 
        !isTyping && 
        content && 
        content.includes('```sql') 
          ? { cursor: 'pointer' } 
          : {}
      }
    >
      {type === 'user' ? (
        <div className="bubble-user">
          <div className="bubble-content">{content}</div>
          <div className="bubble-time">{time}</div>
        </div>
      ) : (
        <div className="bubble-system">
          <div className="bubble-header">
            <i className="fas fa-database"></i>
            {isLoading && <span className="loading-text">Procesando...</span>}
          </div>
          <div className="bubble-content">
            {isLoading ? (
              <LoadingDots />
            ) : (
              renderContent(content, isTyping)
            )}
          </div>
          {!isLoading && <div className="bubble-time">{time}</div>}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada para evitar re-renders innecesarios
  const prevMessage = prevProps.message;
  const nextMessage = nextProps.message;
  
  return (
    prevMessage.id === nextMessage.id &&
    prevMessage.type === nextMessage.type &&
    prevMessage.content === nextMessage.content &&
    prevMessage.time === nextMessage.time &&
    prevMessage.isLoading === nextMessage.isLoading &&
    prevMessage.isTyping === nextMessage.isTyping &&
    prevMessage.isHistorical === nextMessage.isHistorical &&
    prevProps.onOpenModal === nextProps.onOpenModal
  );
});

ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
