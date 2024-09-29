import React, { useEffect, useState } from 'react';
import { ProList as AntdProList } from '@ant-design/pro-components';
import './proList.css';
import useColumnCount from '../ui_hooks/useColCount';
import { AppConfig, DataItem, Position, Size } from '../data/types';
import { renderListActions, renderCardContent, renderCardTitle, renderListAvatar, renderListContent, renderListDescription, renderListTitle, renderTag, renderCardActions2, renderContextMenuActions } from './proListMeta';
import { DisplayMode } from '../data/enums';
import { PARENT_MAIN_CONTAINER_ID } from '../data/constants';

interface ProListProps {
    mode: DisplayMode;
    data: DataItem[];
    userConfig: AppConfig;
    size?: Size
    emptyNode: React.ReactNode;
    loading?: boolean
    [key: string]: any;
}


// 根据模式返回相应的元数据配置
const getMetas = (mode: DisplayMode, props: { userConfig: AppConfig, [key: string]: any }) => (
    DisplayMode.isCard(mode)
        ? {
            title: { render: (_: any, record: any) => renderCardTitle({ record, ...props }) },
            content: { render: (_: any, record: any) => renderCardContent({ record, ...props }) },
            actions: { render: (_: any, record: any) => renderCardActions2({ record, ...props }) },
        }
        : {
            avatar: { render: (_: any, record: any) => renderListAvatar({ record, ...props }) },
            title: { render: (_: any, record: any) => renderListTitle({ record, ...props }) },
            description: { render: (_: any, record: any) => renderListDescription({ record, ...props }) },
            content: { render: (_: any, record: any) => renderListContent({ record, ...props }) },
            subTitle: { render: (_: any, record: any) => renderTag({ record, ...props }) },
            actions: { render: (_: any, record: any) => renderListActions({ record, ...props }) },
        }
);


const ProList: React.FC<ProListProps> = ({ data, mode, userConfig, size, emptyNode, loading, dirhandler, scrollPosition }: ProListProps) => {
    if (!data || data.length === 0) return emptyNode;

    const colCount = useColumnCount(size?.width);
    const [rightMenuItem, setRightMenuItem] = useState<DataItem>(data[0]);
    const [rightMenuDisplay, setRightMenuDisplay] = useState<boolean>(false);
    const [rightMenuPosition, setRightMenuPosition] = useState<Position>({} as Position)

    const handleDocumentClick = (event: MouseEvent) => {
        // 检查点击事件的目标是否不在 Popover 内部
        if (!(event.target as Element).closest('.right-menu')) {
            setRightMenuDisplay(false);
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

    const handleMenuEvent = (e: React.MouseEvent<any, MouseEvent> | React.MouseEvent<HTMLElement, MouseEvent>, record: DataItem) => {
        // 获取主容器的位置和尺寸信息
        const mainContainer = parent.document.getElementById(PARENT_MAIN_CONTAINER_ID);
        const rect = mainContainer?.getBoundingClientRect() ?? { x: 0, y: 0 };

        // 显示右键菜单，并设置菜单项和位置
        setRightMenuDisplay(true)
        setRightMenuItem(record)
        setRightMenuPosition({ left: e.pageX - rect.x, top: scrollPosition.top + e.pageY - 80 - rect.y })
    }

    return (
        <div>
            <AntdProList<DataItem>
                ghost={true}
                itemCardProps={{ ghost: true, className: 'list', bodyStyle: { padding: 0, paddingLeft: 18 }, }}
                rowKey='name'
                dataSource={data}
                showActions='hover'
                showExtra='always'
                grid={DisplayMode.isCard(mode) ? { gutter: colCount < 4 ? 8 : 16, column: colCount } : undefined}
                onRow={(record: any) => ({ onContextMenu: (e) => { handleMenuEvent(e, record) } })}
                // onItem={(record: any) => ({ onContextMenu: (e) => { handleMenuEvent(e, record) } })}
                metas={getMetas(mode, { userConfig, bodyWidth: size?.width, bodyHeight: size?.height, dirhandler })} // 根据mode选择不同的metas
                virtual
                loading={loading}
            />
            <div className='right-menu' style={{
                display: rightMenuDisplay ? 'block' : 'none',
                backgroundColor: `var(--ls-primary-background-color)`,
                color: `var(--ls-primary-text-color)`,
                position: 'absolute',
                left: rightMenuPosition.left,
                top: rightMenuPosition.top,
                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)', /* 阴影效果 */
                transition: 'opacity 0.5s ease, visibility 0.5s ease',
                zIndex: 2
            }}  >
                {renderContextMenuActions({ record: rightMenuItem, userConfig, dirhandler }, setRightMenuDisplay)}
            </div>
        </div>
    );
};

export default ProList;