import React, { memo } from 'react';

const HistorySidebar = memo(({ 
  isOpen, 
  onToggle, 
  historyRef, 
  history, 
  currentConversationId,
  onCreateNew, 
  onDeleteConversation, 
  onSelectConversation 
}) => {
  return (
    <div className={`history-sidebar${isOpen ? ' open' : ''}`} ref={historyRef}>
      <div className="menu-header" onClick={onToggle}>
        <span>Historial</span>
        <i className="fas fa-book"></i>
      </div>
      <div className="history-content">
        <input className="history-search" type="text" placeholder="Buscar conversación" />
        
        {/* Botón para crear nueva conversación */}
        <div className="history-actions">
          <button className="new-conversation-btn" onClick={onCreateNew}>
            <i className="fas fa-plus"></i> Nueva Conversación
          </button>
        </div>
        
        <ul className="history-list">
          {history.map((item) => (
            <li 
              key={item.id} 
              className={currentConversationId === item.id ? 'active' : ''}
              onClick={() => onSelectConversation(item.id)}
            >
              <div className="history-item-content">
                <div className="history-title">{item.title}</div>
                <div className="history-snippet">{item.snippet}</div>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(item.id);
                }}
                title="Eliminar conversación"
              >
                <i className="fas fa-trash"></i>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

HistorySidebar.displayName = 'HistorySidebar';

export default HistorySidebar;
