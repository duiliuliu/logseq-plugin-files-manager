// src/components/ActionItem.tsx
import React from 'react';
import './actionItem.css'; // 引入样式文件
import { Tooltip } from 'antd';
import { logger } from '../utils/logger';


export interface ActionItemProps {
  icon: React.ElementType;
  text: string;
  onClick: (e: any) => void;
  disable?: boolean
  compact?: boolean
}
const ActionItem: React.FC<ActionItemProps> = ({ icon: Icon, text, onClick, disable, compact = false }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!disable) {
      logger.debug('handleClick', text, 'disable', disable)
      onClick(e);
    }
  };

  return (
    <div
      className={`action-item ${disable ? 'disabled' : ''} ${compact ? 'compact' : ''}`}
      tabIndex={0} // 使组件可聚焦
      role="button" // 提高无障碍性
      aria-disabled={disable} // 为屏幕阅读器提供信息
      onClick={handleClick}
    >
      <span><Icon size={compact ? 12 : 15} weight='regular' /></span>&nbsp;&nbsp;
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