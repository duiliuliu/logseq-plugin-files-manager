// src/components/ActionItem.tsx
import React from 'react';
import './actionItem.css'; // 引入样式文件


export interface ActionItemProps {
  icon: React.ElementType;
  text: string;
  onClick: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon: Icon, text, onClick }) => {
  return (
    <div className='action-item' onClick={onClick}>
      <span><Icon size={15} weight='bold' /></span>
      <strong>{text}</strong>
    </div>
  );
};

export default ActionItem;