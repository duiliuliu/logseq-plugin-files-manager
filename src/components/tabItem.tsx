// src/components/TabItem.tsx
import React from 'react';
import { Badge } from 'antd';

interface TabItemProps {
    item: {
        icon?: React.ReactNode;
        label: React.ReactNode;
        key: string;
    };
    iconOnly: boolean;
    activeKey: string;
    tabCounts?: { [key: string]: number };
    settingClick?: () => void
}

const TabItem: React.FC<TabItemProps> = ({ item, iconOnly, activeKey, tabCounts, settingClick }) => {
    return (
        <div onClick={settingClick}>
            {item.icon}
            {!iconOnly && <strong style={{ marginLeft: '6px', marginRight: '6px' }}>{item.label}</strong>}
            {!iconOnly && activeKey === item.key && tabCounts && (
                <Badge count={tabCounts[item.key]} overflowCount={9999} color='cyan' size='small' />
            )}
        </div>
    );
};

export default TabItem;