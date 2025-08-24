import React from 'react';

const MenuSidebar = ({ isOpen, onToggle, menuRef }) => {
  return (
    <div className={`menu-sidebar${isOpen ? ' open' : ''}`} ref={menuRef}>
      <div className="menu-header" onClick={onToggle}>
        <span>Menú</span>
        <i className="fas fa-bars"></i>
      </div>
      <ul>
        <li><i className="fas fa-home"></i> Inicio</li>
        <li><i className="fas fa-cog"></i> Configuración</li>
        <li><i className="fas fa-question-circle"></i> Ayuda</li>
        <li><i className="fas fa-info-circle"></i> Acerca de</li>
      </ul>
    </div>
  );
};

export default MenuSidebar;
