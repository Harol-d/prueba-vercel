import React from 'react';

const Modal = ({ isOpen, message, onClose, onCopy }) => {
  if (!isOpen || !message || !message.content) return null;

  // Función para extraer el código SQL del mensaje
  const extractSQLCode = (content) => {
    try {
      if (content.includes('```sql')) {
        const codeMatch = content.match(/```sql([\s\S]*?)```/);
        return codeMatch ? codeMatch[1].trim() : content;
      }
      return content;
    } catch (error) {
      return content || 'Error al mostrar el contenido';
    }
  };

  const sqlCode = extractSQLCode(message.content);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-message" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Consulta SQL Completa</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <pre className="sql-block-modal">
            {sqlCode}
          </pre>
        </div>
        <button className="modal-copy" onClick={() => onCopy(sqlCode)}>
          Copiar Código
        </button>
      </div>
    </div>
  );
};

export default Modal;
