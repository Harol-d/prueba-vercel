import React, { useState, useEffect, useRef } from 'react';

const Footer = ({ onSendQuery }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize del textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxHeight = 120; // máximo 5 líneas aproximadamente
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Manejar cambios en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) {
      return;
    }
    
    // Guardar el valor antes de limpiarlo
    const messageToSend = inputValue.trim();
    
    // Limpiar inmediatamente el input para mejor UX
    setInputValue('');
    
    // Resetear altura del textarea inmediatamente
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsLoading(true);
    
    try {
      await onSendQuery(messageToSend);
    } catch (error) {
      // En caso de error, restaurar el mensaje en el input
      setInputValue(messageToSend);
      // Restaurar altura del textarea
      setTimeout(() => {
        adjustTextareaHeight();
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    // Enter sin Shift: enviar mensaje
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift + Enter: nueva línea (comportamiento por defecto)
  };

  // Manejador adicional para keydown para mejor control
  const handleKeyDown = (e) => {
    // Prevenir envío si está cargando
    if (e.key === 'Enter' && !e.shiftKey && isLoading) {
      e.preventDefault();
    }
  };

  return (
    <footer className="App-footer">
      <form className="input-container" onSubmit={handleSubmit}>
        <textarea 
          ref={textareaRef}
          placeholder="Escribe tu consulta SQL o pregunta..." 
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
          className="input-textarea"
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </form>
    </footer>
  );
};

export default Footer;
