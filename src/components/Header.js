import React from 'react';

const Header = ({ onToggleMenu, onToggleHistory, menuButtonRef, historyButtonRef }) => {
  return (
    <header className="App-header">
      <div className="header-left" onClick={onToggleHistory} ref={historyButtonRef} style={{cursor: 'pointer'}}>
        <i className="fas fa-book"></i>
      </div>
      <div className="header-center">
        <i className="fas fa-database"></i>
        <h1>AgentSQL</h1>
      </div>
      <div className="header-right" onClick={onToggleMenu} ref={menuButtonRef}>
        <i className="fas fa-bars"></i>
      </div>
    </header>
  );
};

export default Header;
