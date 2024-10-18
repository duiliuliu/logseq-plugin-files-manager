// src/components/ActionList.tsx
import React, { useState, useEffect } from 'react';
import { Dropdown, Popover } from 'antd';
import ActionItem, { ActionItemProps } from './actionItem';
import './actionList.css';
import { ItemType } from 'antd/es/menu/interface';

interface ActionListProps {
    actions?: ActionItemProps[];
    open: boolean;
    tabItem: React.ReactNode
    theme?: 'light' | 'dark'
}

const ActionList: React.FC<ActionListProps> = ({ actions, open, tabItem, }) => {
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        // 当 item.key 等于 activeKey 时，Popover 应该打开
        setVisible(open);
    }, [open]);


    const handleDocumentClick = (event: MouseEvent) => {
        // 检查点击事件的目标是否不在 Popover 内部
        if (!(event.target as Element).closest('.action-list')) {
            setVisible(false);
        }
    };

    const handleActionClick = (onCilck: (e: any) => void) => {
        return (e: any) => {
            onCilck(e)
            setVisible(false);
        }
    };

    useEffect(() => {
        // 监听点击事件，以便在点击外部时关闭 Popover
        document.addEventListener('click', handleDocumentClick);

        return () => {
            // 组件卸载时移除事件监听器
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    return (
        <Popover
            className='action-list'
            placement='bottomLeft'
            open={visible}
            content={(
                <div className='action-list-content'>
                    {actions?.map((action, i) => (
                        <ActionItem
                            key={i.toString()}
                            icon={action.icon}
                            text={action.text}
                            onClick={handleActionClick(action.onClick)}
                        />
                    ))}
                </div>
            )}
        >
            {tabItem}
        </Popover>
    );
};


export const ActionList2: React.FC<ActionListProps> = ({ actions, open, tabItem, }) => {
    if (!actions) {
        return <div></div>
    }
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        // 当 item.key 等于 activeKey 时，Popover 应该打开
        setVisible(open);
    }, [open]);

    return <Dropdown
        placement="bottomLeft"
        open={visible}
        menu={{
            items: actions?.map((item, index) => ({
                key: index.toString(),
                label: item.text,
                icon: <item.icon size={15} />,
                onClick: (e) => { item.onClick(e.domEvent) }
            } as ItemType)),
        }}
        onOpenChange={() => setVisible(prev => !prev)}
        trigger={['hover', 'click',]}
    >
        {tabItem}
    </Dropdown >
}

export default ActionList;