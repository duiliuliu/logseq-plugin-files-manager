import React from 'react';
import { ProList as AntdProList } from '@ant-design/pro-components';
import './proList.css';
import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import useColumnCount from '../utils/useColCount';
import { DataItem, Size } from '../data/types';
import { renderListActions, renderCardContent, renderCardTitle, renderListAvatar, renderListContent, renderListDescription, renderListTitle, renderTag, renderCardActions2 } from './proListMeta';
import { DisplayMode } from '../data/enums';

interface ProListProps {
    mode: DisplayMode;
    data: DataItem[];
    userConfig: AppUserConfigs;
    size?: Size
    emptyNode: React.ReactNode;
    loading?: boolean
}


// 根据模式返回相应的元数据配置
const getMetas = (mode: DisplayMode, props: { userConfig: AppUserConfigs, [key: string]: any }) => (
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


const ProList: React.FC<ProListProps> = ({ data, mode, userConfig, size, emptyNode, loading }) => {
    if (!data || data.length === 0) return emptyNode;

    const colCount = useColumnCount(size?.width);

    return (
        <AntdProList<DataItem>
            ghost={true}
            itemCardProps={{ ghost: true, className: 'list', bodyStyle: { padding: 0, paddingLeft: 18 }, }}
            rowKey='name'
            dataSource={data}
            showActions='hover'
            showExtra='always'
            grid={DisplayMode.isCard(mode) ? { gutter: colCount < 4 ? 8 : 16, column: colCount } : undefined}
            editable={{
                onSave: async (_key, _record, _originRow) => {
                    // console.log(key, record, originRow);
                    return true;
                },
            }}
            metas={getMetas(mode, { userConfig, bodyWidth: size?.width, bodyHeight: size?.height })} // 根据mode选择不同的metas
            virtual
            loading={loading}
        />
    );
};

export default ProList;