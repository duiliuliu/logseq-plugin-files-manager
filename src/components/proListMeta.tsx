import { AppUserConfigs } from '@logseq/libs/dist/LSPlugin.user';
import { DataItem } from '../data/types';
import { format } from 'date-fns';
import { getTimeString } from '../utils/timeUtil';
import React from 'react';
import { DataType, RelatedType } from '../data/enums';
import { Dropdown, Modal, Space, Tag } from 'antd';
import { Copy, DotsThree, FolderOpen } from '@phosphor-icons/react';
import { logger } from '../utils/logger';
import { isBook, isImage } from '../utils/fileUtil';
import { buildGraphPath, copyToClipboard } from '../logseq/utils';
import { ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH, i18n_COPY_SUCCESS, i18n_COPY_TOOLTIP, i18n_OPEN_TOOLTIP } from '../data/constants';
import getI18nConstant from '../i18n/utils';
import { ActionItemProps, TooltipActionItem } from './actionItem';
import { ItemType } from 'antd/es/menu/interface';

interface MetaRenderProps {
    userConfig: AppUserConfigs;
    record: DataItem;
    [key: string]: any;
}

const { info } = Modal;

const showPreviewModalAction = ({ record, userConfig, bodyWidth, bodyHeight }: MetaRenderProps) => {
    if (record.path) {
        const width = bodyWidth ? bodyWidth * 0.7 : window.innerWidth * 0.5;
        const height = bodyHeight ? bodyHeight * 0.7 : window.innerHeight * 0.7;
        info({
            title: record.alias,
            icon: renderListAvatar({ record, userConfig }),
            content: <iframe style={{ width: width * 0.8, height }} src={`${record.path}#toolbar=0`}></iframe>,
            centered: true,
            closable: false,
            maskClosable: true,
            keyboard: true,
            footer: <div></div>,
            width, height
        });
    }
};

const renderListTitle = ({ record, userConfig, bodyWidth, bodyHeight }: MetaRenderProps) => (
    <div className='list-title' onClick={() => showPreviewModalAction({ record, userConfig, bodyWidth, bodyHeight })} >
        {record.alias ? record.alias : record.name}
    </div>
);

const renderListDescription = ({ record, userConfig }: MetaRenderProps) => (
    <div className='list-description'>
        {record.size ? record.size + ' • ' : ''}{format(new Date(record.updatedTime!), userConfig.preferredDateFormat)} {getTimeString(record.updatedTime!)}
    </div>
);

const renderListAvatar = ({ record }: MetaRenderProps) => (
    <div className='list-avatar'>{record.extName ? record.extName.toUpperCase() : '🕰'}</div>
);

// 渲染列表内容的函数，接受包含记录和用户配置的对象作为参数
const renderListContent = ({ record, userConfig }: MetaRenderProps) => {
    // 提取图像内容
    const imgContent = record.image || record.dataType === DataType.IMG_ASSET ? (
        <div className='list-image flex-1 ml-3' style={{ display: 'block' }}>
            <img
                src={`${buildGraphPath(userConfig.currentGraph)}/assets/${record.dataType === DataType.IMG_ASSET ? record.name : record.image!}`}
                alt='image'
            />
        </div>
    ) : null;

    // 提取块内容
    const blockContent = DataType.isAssetFile(record.dataType) && record.related ? (
        record.related
            .filter(item => item.relatedType === RelatedType.BLOCK || item.relatedType === RelatedType.PAGE)
            .map(item => (<div className='list-description' onClick={() => {
                if (item.relatedType === RelatedType.BLOCK) {
                    logseq.Editor.scrollToBlockInPage(
                        item.relatedBlockPage!,
                        item.relatedItemUuid!
                    );
                } else {
                    logseq.App.pushState('page', { name: item.relatedBlockPage });
                }
                logseq.hideMainUI();
            }} >
                {item.relatedBlockContent ?? 'block content'}<br />
            </div>
            ))
    ) : null;

    // 返回渲染的列表内容
    return (
        <div>
            {imgContent} {blockContent}
        </div>
    );
};

const renderTag = ({ record }: MetaRenderProps) => {
    return (
        <Space size={0}>
            {
                record.related?.filter(item => item.relatedType === RelatedType.TAG).map(item => (
                    <Tag rootClassName='tag' className='list-tag' key={item.relatedTag} onClick={() => {
                        logseq.App.pushState('page', { name: item.relatedTag })
                        logseq.hideMainUI()
                    }}>{item.relatedTag}</Tag>
                ))
            }
        </Space>
    );
}

const renderListActions = ({ record, userConfig }: MetaRenderProps) => {

    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig })
    ]

    return <Dropdown
        // placement="bottomRight"
        menu={{
            items: actions.map((item, index) => ({
                key: index.toString(),
                label: item.text,
                icon: <item.icon size={15} weight={'duotone'} />,
                onClick: (e) => { item.onClick(e.domEvent) }
            } as ItemType)),
        }}
    >
        <DotsThree size={24} />
    </Dropdown>
};


const renderCardActions2 = ({ record, userConfig }: MetaRenderProps) => {

    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig })
    ]

    return <Dropdown
        // placement="bottomRight"
        menu={{
            items: actions.map((item, index) => ({
                key: index.toString(),
                icon: <TooltipActionItem
                    key={index.toString()}
                    icon={item.icon}
                    text={item.text}
                    onClick={item.onClick} />,
                onClick: (e) => { item.onClick(e.domEvent) }
            } as ItemType)),
        }}
    >
        <DotsThree size={24} />
    </Dropdown>
};


const renderCardActions = ({ record, userConfig }: MetaRenderProps) => {

    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig })
    ]

    return <span className='list-actions' >
        <Space.Compact block>
            {actions.map((item, index) => (
                <TooltipActionItem
                    key={index.toString()}
                    icon={item.icon}
                    text={item.text}
                    onClick={item.onClick} />
            ))}

        </Space.Compact>
    </span>
};

const copyFileNodeAction = ({ record, userConfig }: MetaRenderProps): ActionItemProps => ({
    icon: Copy,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_COPY_TOOLTIP),
    onClick: () => {
        let copyValue = '';

        // 检查是否为资产文件类型
        if (DataType.isAssetFile(record.dataType)) {
            // 获取相关块
            const relatedBlocks = record.related?.filter(item => item.relatedType === RelatedType.BLOCK);

            // 如果存在相关块，使用块的UUID
            if (relatedBlocks && relatedBlocks?.length > 0) {
                copyValue = `((${relatedBlocks[0].relatedItemUuid}))`;
            } else {
                // 否则，构建文件路径
                const filePath = record.path?.replace(ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH);
                copyValue = DataType.IMG_ASSET === record.dataType
                    ? `![${record.alias}](${filePath})` // 图片资产使用Markdown图片语法
                    : `[${record.alias}](${filePath})`; // 其他资产使用Markdown链接语法
            }
        } else {
            // 如果不是资产文件，使用Logseq的页面链接语法
            copyValue = `[[${record.alias}]]`;
        }

        // 将值复制到剪贴板
        copyToClipboard(copyValue);

        // 显示成功消息 
        logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_COPY_SUCCESS), 'success');
    }
})


const openFileAction = ({ record, userConfig }: MetaRenderProps): ActionItemProps => (
    {
        icon: FolderOpen,
        text: getI18nConstant(userConfig.preferredLanguage, i18n_OPEN_TOOLTIP),
        onClick: (e) => {
            if (record.extName && isBook(record.extName)) {
                // logger.debug(`window.open, path:${record.path}`)
                // window.open(record.path)
                // logger.debug(`logseq.App.openPath, path:${record.path}`)
                // logseq.App.openPath(record.path)
                logger.debug(`logseq.App.builtInOpen, path:${record.path}`)
                // @ts-ignore
                logseq.Assets.builtInOpen(record.path)
            } else if (!DataType.isAssetFile(record.dataType)) {
                if (e.nativeEvent.shiftKey) {
                    logseq.Editor.openInRightSidebar(record.uuid!);
                }
                else {
                    logger.debug(`logseq.App.pushState, page:${record.name}`)
                    logseq.App.pushState('page', { name: record.alias, });
                }
            } else {
                logger.debug(`logseq.App.openPath, path:${record.path}`)
                // logseq.App.showItemInFolder(record.path)
                logseq.App.openPath(record.path)
            }
            e.stopPropagation();
            logseq.hideMainUI({ restoreEditingCursor: true });
        }
    }
)

const renderCardTitle = ({ record, }: MetaRenderProps) => (
    <div className='card-title-container'>
        <div className='card-avatar'>{record.extName ? record.extName.toUpperCase() : '🕰'}</div>
        {(record.dataType === DataType.PAGE || record.dataType === DataType.JOURNAL) && <div className='card-description'>{record.alias}</div>}
    </div>
);

const renderCardContent = ({ record, userConfig, bodyWidth, bodyHeight }: MetaRenderProps) => {
    if (record.summary && record.summary.length > 0) {
        return (
            <div className='list-content'>
                <div className='list-summary' style={{ display: 'block' }}>
                    {record.summary?.map((item, idx) => (
                        item && <React.Fragment key={idx}>{item}<br /></React.Fragment>
                    ))}
                </div>
            </div>
        );
    } else if (record.image || (record.extName && isImage(record.extName))) {
        let imagePath = '';
        switch (record.dataType) {
            case DataType.IMG_ASSET: imagePath = record.name; break;
            case DataType.PAGE: if (record.image) imagePath = record.image!; break;
        }

        return (
            <div className='list-content'>
                <div className='list-image' style={{ display: 'block' }}>
                    <img src={`${buildGraphPath(userConfig.currentGraph)}/assets/${imagePath}`} alt='image' />
                </div>
            </div>
        );
    } else {
        return (
            <div className='list-content'>
                {renderListTitle({ record, userConfig, bodyWidth, bodyHeight })}
                {renderListDescription({ record, userConfig })}
            </div>
        )
    }
};

export {
    renderListTitle,
    renderListDescription,
    renderListAvatar,
    renderListContent,
    renderTag,
    renderListActions,
    renderCardActions,
    renderCardActions2,
    renderCardTitle,
    renderCardContent
};