// src/components/ActionItem.tsx
import React from 'react';
import './actionItem.css'; // 引入样式文件
import { Tooltip } from 'antd';


export interface ActionItemProps {
  icon: React.ElementType;
  text: string;
  onClick: (e: any) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({ icon: Icon, text, onClick }) => {
  return (
    <div className='action-item' onClick={onClick}>
      <span><Icon size={15} weight='regular' /></span>&nbsp;&nbsp;
      <strong>{text}</strong>
    </div>
  );
};


export const TooltipActionItem = ({ icon: Icon, text, onClick }: ActionItemProps) => {
  return (
    <Tooltip title={text}>
      <a onClick={onClick}  >
        <Icon size={15} weight={'duotone'} />
      </a>
    </Tooltip>
  )
}


export default ActionItem;