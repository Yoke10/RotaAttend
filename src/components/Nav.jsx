import React from 'react';
import { FaCalendarAlt, FaRegFileAlt, FaChartBar } from 'react-icons/fa';

const Nav = ({ onEClick, onTClick, onAClick }) => {
  const navItems = [
    { label: 'Event Management', icon: <FaCalendarAlt />, onClick: onEClick },
    { label: 'Template Creation', icon: <FaRegFileAlt />, onClick: onTClick },
    { label: 'Analytics', icon: <FaChartBar />, onClick: onAClick },
  ];

  return (
    <div
      className="flex flex-col md:flex-row p-2 gap-10 items-center justify-center"
    >
      {navItems.map((item) => (
        <div
          key={item.label}
          onClick={item.onClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: 'orange',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {item.icon}
          <span style={{ marginLeft: '8px' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Nav;
