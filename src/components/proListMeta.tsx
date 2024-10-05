import { AppConfig, DataItem } from '../data/types';
import { format } from 'date-fns';
import { getTimeString } from '../utils/timeUtil';
import React from 'react';
import { DataType, OperationType, RelatedType } from '../data/enums';
import { Dropdown, Modal, Space, Tag } from 'antd';
import { Copy, CopySimple, DotsThree, Eye, FolderOpen, FolderPlus, GearSix, Swap, Trash } from '@phosphor-icons/react';
import { isDebug, logger } from '../utils/logger';
import { isBook, isImage, verifyPermission } from '../utils/fileUtil';
import { buildGraphPath, copyToClipboard } from '../logseq/logseqCommonProxy';
import { ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH, i18n_COPY_SUCCESS, i18n_COPY_PATH_TOOLTIP, i18n_DELETE_ERROR, i18n_DELETE_SUCCESS, i18n_DELETE_TOOLTIP, i18n_FILE_DENY, i18n_OPEN_FILE_TOOLTIP, i18n_PREVIEW_TOOLTIP, i18n_COPY_TITLE_TOOLTIP, i18n_OPEN_FOLDER_ERROR, i18n_OPEN_FOLDER_TOOLTIP, i18n_RENAME_TOOLTIP, OPERATE_FAILED, OPERATE_SUCCESS, i18n_DEV_DATA_INFO, i18n_OPEN_PLUGN_SETTING_TOOLTIP, DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN } from '../data/constants';
import getI18nConstant from '../i18n/utils';
import ActionItem, { ActionItemProps, TooltipActionItem } from './actionItem';
import { ItemType } from 'antd/es/menu/interface';
import PreviewFrame from './previewItem';
import { trace } from '../logseq/feat/logseqAddOptLog';
import { deleteLogseqAsset, deleteLogseqPage } from '../logseq/feat/logseqDeletePage';


// 定义 MetaRenderProps 接口，用于传递给渲染函数的属性
interface MetaRenderProps {
    userConfig: AppConfig;
    record: DataItem;
    [key: string]: any;
}

// 引入 Modal 中的 info 方法，用于显示信息弹窗
const { info } = Modal;

// =============== Action Functions ===============

const showDebugInfoAction = ({ record, userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: Eye,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_DEV_DATA_INFO),
    onClick: () => {
        setRightMenuDisplay && setRightMenuDisplay(false)
        info({
            title: <p onDoubleClick={copyTitleAction({ record, userConfig }).onClick}>{record.alias} </p>,
            icon: renderListAvatar({ record, userConfig }),
            centered: true,
            content: <pre style={{
                backgroundColor: '#f4f4f4',
                padding: '10px',
                border: '1px solid #ddd;',
                borderRadius: '5px',
                width: 340,
                height: 160,
                overflow: 'auto'
            }}> <code>{JSON.stringify(record, null, 4)}</code></pre>,
            closable: false,
            maskClosable: true,
            keyboard: true,
            footer: <div></div>,
        });
    }
})

/**
 * 显示预览模态框的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, bodyWidth, bodyHeight, setRightMenuDisplay 的属性
 */
const showPreviewModalAction = ({ record, userConfig, bodyWidth, bodyHeight, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: Eye,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_PREVIEW_TOOLTIP),
    onClick: () => {
        setRightMenuDisplay && setRightMenuDisplay(false)
        if (record.path) {
            const width = bodyWidth ? bodyWidth * 0.7 : window.innerWidth * 0.5;
            const height = bodyHeight ? bodyHeight * 0.7 : window.innerHeight * 0.7;
            info({
                title: <p onDoubleClick={copyTitleAction({ record, userConfig }).onClick}>{record.alias} </p>,
                icon: renderListAvatar({ record, userConfig }),
                content: <PreviewFrame
                    src={record.path}
                    height={height}
                    width={width}
                    dataType={record.dataType}
                    extName={record.extName}
                />,
                centered: true,
                closable: false,
                maskClosable: true,
                keyboard: true,
                footer: <div></div>,
                width, height
            });
        }
    }
});

/**
 * 复制标题的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, setRightMenuDisplay 的属性
 */
const copyTitleAction = ({ record, userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: CopySimple,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_COPY_TITLE_TOOLTIP),
    onClick: () => {
        setRightMenuDisplay && setRightMenuDisplay(false)
        copyToClipboard(record.alias)
        logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_COPY_SUCCESS), 'success');
    }
});

/**
 * 复制文件路径的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, setRightMenuDisplay 的属性
 */
const copyFileNodeAction = ({ record, userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: Copy,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_COPY_PATH_TOOLTIP),
    onClick: () => {
        let copyValue = '';
        setRightMenuDisplay && setRightMenuDisplay(false)

        // 检查是否为资产文件类型
        if (DataType.isAssetFile(record.dataType)) {
            // 获取相关块
            const relatedBlocks = record.related?.filter(item => item.relatedType === RelatedType.BLOCK);

            // 如果存在相关块，使用块的UUID
            if (relatedBlocks && relatedBlocks?.length > 0 && !isBook(record.extName!)) {
                copyValue = `((${relatedBlocks[0].relatedItemUuid}))`;
            } else {
                // 否则，构建文件路径
                const filePath = record.path?.replace(ASSETS_PATH_REGEX, ASSETS_REPLACE_PATH);
                copyValue = `![${record.alias}](${filePath})`;
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


/**
 * 打开文件的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, setRightMenuDisplay 的属性
 */
const openFileAction = ({ record, userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: FolderPlus,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_OPEN_FILE_TOOLTIP),
    onClick: (e) => {
        setRightMenuDisplay && setRightMenuDisplay(false)

        if (record.extName && isBook(record.extName)) {
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
            logseq.App.openPath(record.path)
        }
        e.stopPropagation();
        logseq.hideMainUI({ restoreEditingCursor: true });
    }
})

/**
 * 打开文件夹的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, setRightMenuDisplay 的属性
 */
const openFolderAction = ({ record, userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: FolderOpen,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_OPEN_FOLDER_TOOLTIP),
    onClick: async (e) => {
        setRightMenuDisplay && setRightMenuDisplay(false)
        try {
            await logseq.App.showItemInFolder(record.path)
            e.stopPropagation();
            logseq.hideMainUI({ restoreEditingCursor: true });
        } catch (error) {
            logseq.UI.showMsg(`[:p "${getI18nConstant(userConfig.preferredLanguage, i18n_OPEN_FOLDER_ERROR)}" [:br][:br] "${error}"]`, 'error')
        }
    }
})

/**
 * 删除文件的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler, setRightMenuDisplay 的属性
 */
const deleteFileAction = ({ record, userConfig, dirhandler: getDirectoryHandle, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: Trash,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_TOOLTIP),
    onClick: async (_e) => {
        setRightMenuDisplay && setRightMenuDisplay(false)
        let result = OPERATE_FAILED
        let content = '...'
        let refBlocks = ''

        try {
            if (DataType.isAssetFile(record.dataType)) {
                if (DELETE_ASSET_VERSION_NEED_DIR_HANDLER_FN()) {
                    const dirHandler = (await getDirectoryHandle()) as FileSystemDirectoryHandle
                    const assetdirHandler = await dirHandler?.getDirectoryHandle(userConfig.assetsDirectory!)
                    const permiss = await verifyPermission(assetdirHandler, true)
                    if (!permiss) {
                        logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_FILE_DENY), 'warn')
                        result = OPERATE_FAILED
                        content = getI18nConstant(userConfig.preferredLanguage, i18n_FILE_DENY)
                    } else {
                        // 删除日志或页面的其他相关数据
                        refBlocks = (await deleteLogseqAsset(record, userConfig, assetdirHandler)).join(', ');

                        logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS), 'info')
                        result = OPERATE_SUCCESS
                        content = getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS)
                    }
                } else {
                    // 删除日志或页面的其他相关数据
                    refBlocks = (await deleteLogseqAsset(record, userConfig, null)).join(', ');

                    logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS), 'info')
                    result = OPERATE_SUCCESS
                    content = getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS)
                }
            }

            if (record.dataType === DataType.JOURNAL || record.dataType === DataType.PAGE) {
                // 删除日志或页面的其他相关数据
                refBlocks = (await deleteLogseqPage(record.alias, userConfig)).join(', ');

                // 成功提示
                result = OPERATE_SUCCESS;
                content = getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS);
                logseq.UI.showMsg(getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_SUCCESS), 'info');
            }

        } catch (error) {
            const errorMessage = getI18nConstant(userConfig.preferredLanguage, i18n_DELETE_ERROR);
            const errorDetails = `[:p "${errorMessage}" [:br][:br] "${error}"]`;
            result = OPERATE_FAILED;
            content = error instanceof Error ? error.message : `${error}`;
            logseq.UI.showMsg(errorDetails, 'error');
        }


        trace(userConfig, content, {
            file: record.name,
            fileAlias: record.alias,
            fileType: record.dataType,
            operate: OperationType.DELETE,
            refBlocks,
            result
        })
    }
})

/**
 * 重命名文件的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler, setRightMenuDisplay 的属性
 */
const renameFileAction = ({ userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: Swap,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_RENAME_TOOLTIP),
    onClick: async (_e) => { setRightMenuDisplay && setRightMenuDisplay(false); console.log("还在支持中, 敬请期待！") },
    disable: true
})

/**
 * 重命名文件的 Action 函数
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler, setRightMenuDisplay 的属性
 */
const openPluginSettingAction = ({ userConfig, setRightMenuDisplay }: MetaRenderProps): ActionItemProps => ({
    icon: GearSix,
    text: getI18nConstant(userConfig.preferredLanguage, i18n_OPEN_PLUGN_SETTING_TOOLTIP),
    onClick: async (_e) => { setRightMenuDisplay && setRightMenuDisplay(false); logseq.showSettingsUI() },
})



// =============== Render list component ===============

/**
 * 渲染列表标题
 * @param {MetaRenderProps} props - 包含 record, userConfig, bodyWidth, bodyHeight 的属性
 */
const renderListTitle = ({ record, userConfig, bodyWidth, bodyHeight }: MetaRenderProps) => (
    <div className='list-title'
        onDoubleClick={copyTitleAction({ record, userConfig }).onClick}
        onClick={showPreviewModalAction({ record, userConfig, bodyWidth, bodyHeight }).onClick} >
        {record.alias ? record.alias : record.name}
    </div>
);

/**
 * 渲染列表描述
 * @param {MetaRenderProps} props - 包含 record, userConfig 的属性
 */
const renderListDescription = ({ record, userConfig }: MetaRenderProps) => (
    <div className='list-description'>
        {record.size ? record.size + ' • ' : ''}{format(new Date(record.updatedTime!), userConfig.preferredDateFormat)} {getTimeString(record.updatedTime!)}
    </div>
);

/**
 * 渲染列表头像
 * @param {MetaRenderProps} props - 包含 record 的属性
 */
const renderListAvatar = ({ record }: MetaRenderProps) => (
    <div className='list-avatar' >{record.icon ? record.icon : record.extName ? record.extName.toUpperCase() : '🕰'}</div>
);

/**
 * 渲染列表内容
 * @param {MetaRenderProps} props - 包含 record, userConfig 的属性
 */
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

/**
 * 渲染标签
 * @param {MetaRenderProps} props - 包含 record 的属性
 */
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

// =============== Render card component ===============

/**
 * 渲染卡片标题
 * @param {MetaRenderProps} props - 包含 record, userConfig 的属性
 */
const renderCardTitle = ({ record, userConfig }: MetaRenderProps) => (
    <div className='card-title-container'>
        <div className='card-avatar' onDoubleClick={() => copyTitleAction({ record, userConfig })}>{record.icon ? record.icon : record.extName ? record.extName.toUpperCase() : '🕰'}</div>
        {(record.dataType === DataType.PAGE || record.dataType === DataType.JOURNAL) && <div className='card-description'>{record.alias}</div>}
    </div>
);

/**
 * 渲染卡片内容
 * @param {MetaRenderProps} props - 包含 record, userConfig, bodyWidth, bodyHeight 的属性
 */
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

// =============== Render actions Functions ===============

/**
 * 渲染上下文菜单操作
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler 的属性
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setRightMenuDisplay - 设置右键菜单显示状态的函数
 */
const renderContextMenuActions = ({ record, userConfig, dirhandler }: MetaRenderProps, setRightMenuDisplay: React.Dispatch<React.SetStateAction<boolean>>) => {
    const actions = [
        openFileAction({ record, userConfig, setRightMenuDisplay }),
        copyFileNodeAction({ record, userConfig, setRightMenuDisplay }),
        deleteFileAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
        renameFileAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
        openFolderAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
        showPreviewModalAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
        copyTitleAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
        openPluginSettingAction({ record, userConfig, dirhandler, setRightMenuDisplay }),
    ]
    isDebug && actions.push(showDebugInfoAction({ record, userConfig, dirhandler, setRightMenuDisplay }))

    return <span className='list-actions' >
        <Space.Compact direction="vertical">
            {actions.map((item, index) => (
                <ActionItem
                    key={index.toString()}
                    icon={item.icon}
                    text={item.text}
                    onClick={item.onClick}
                    disable={item.disable}
                    compact
                />
            ))}
        </Space.Compact>
    </span>
};

/**
 * 渲染列表操作
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler 的属性
 */
const renderListActions = ({ record, userConfig, dirhandler }: MetaRenderProps) => {
    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig }),
        deleteFileAction({ record, userConfig, dirhandler })
    ]

    return <Dropdown
        placement="bottomRight"
        menu={{
            items: actions.map((item, index) => ({
                key: index.toString(),
                label: item.text,
                icon: <item.icon size={15} weight={'regular'} />,
                onClick: (e) => { item.onClick(e.domEvent) }
            } as ItemType)),
        }}
    >
        <DotsThree size={24} />
    </Dropdown>
};

/**
 * 渲染卡片操作2
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler 的属性
 */
const renderCardActions2 = ({ record, userConfig, dirhandler }: MetaRenderProps) => {
    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig }),
        deleteFileAction({ record, userConfig, dirhandler })
    ]

    return <Dropdown
        menu={{
            items: actions.map((item, index) => ({
                key: index.toString(),
                icon: <TooltipActionItem
                    key={index.toString()}
                    icon={item.icon}
                    text={item.text}
                    onClick={item.onClick} />
            } as ItemType)),
        }}
    >
        <DotsThree size={24} />
    </Dropdown>
};

/**
 * 渲染卡片操作
 * @param {MetaRenderProps} props - 包含 record, userConfig, dirhandler 的属性
 */
const renderCardActions = ({ record, userConfig, dirhandler }: MetaRenderProps) => {

    const actions = [
        openFileAction({ record, userConfig }),
        copyFileNodeAction({ record, userConfig }),
        deleteFileAction({ record, userConfig, dirhandler })
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

export {
    renderListTitle,
    renderListDescription,
    renderListAvatar,
    renderListContent,
    renderTag,
    renderContextMenuActions,
    renderListActions,
    renderCardActions,
    renderCardActions2,
    renderCardTitle,
    renderCardContent
}; 