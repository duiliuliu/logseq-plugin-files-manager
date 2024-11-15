// src/App.tsx
import React, { useRef, useState } from 'react';
import Tabs from './components/tabs';
import { Button, ConfigProvider, Empty, GetProps, Input, Result, Spin, } from 'antd';
import { ActionItemProps } from './components/actionItem';
import { ArrowsClockwise, FolderSimplePlus, List, Newspaper, SquaresFour, Table } from '@phosphor-icons/react';
import Search from 'antd/es/input/Search';
import { DisplayMode, TabEnum } from './data/enums';
import ProList from './components/proList';
import { useLoadData } from './data/useLoadData';
import { useRebuildData } from './data/useRebuildData';
import { useLoadDataCount } from './data/useLoadDataCount';
import useCalculateHeight from './ui_hooks/useCalculateHeight';
import { i18n_AUTHORIZE, i18n_AUTHORIZE_TOOLTIP, i18n_AUTHORIZE_TOOLTIP_PATH, i18n_BUILDING, i18n_LOG_TOOLTIP, i18n_REBUILD_DATA, i18n_SEARCH_PLACEHOLDER, i18n_VIEW_CARD_MODE, i18n_VIEW_LIST_MODE, i18n_VIEW_TABLE_MODE, LOG_PAGE, } from './data/constants';
import { useFileChangeListener } from './data/useFileChangeListener';
import getI18nConstant from './i18n/utils';
import { useUserConfigs } from './logseq/useUserConfigs';
import useTabData from './data/useTabData';
import useTheme from './data/useLoadTheme';
import { buildGraphPath } from './logseq/logseqCommonProxy';
import { useUpdateMaxNumberOnScroll } from './ui_hooks/useUpdateOnScroll';
import useComponentSizeAndPosition from './ui_hooks/useSizeAndPos';
import { useDirectoryHandle } from './ui_hooks/useDirectoryHandle';
import { initLogCfg } from './logseq/feat/logseqAddOptLog';
import VirtualTable, { TableSettings } from './components/proTable';
import { tableColumns } from './components/proTableMeta';

type SearchProps = GetProps<typeof Input.Search>;

const App: React.FC = () => {
    const [userConfigUpdated, setUserConfigUpdated] = useState<number>(Date.now())
    const userConfig = useUserConfigs(userConfigUpdated);
    const { directoryHandle, getDirectoryHandle } = useDirectoryHandle({ graph: userConfig.currentGraph })
    const fileModified = useFileChangeListener(userConfig, directoryHandle, setUserConfigUpdated)   // 使用 useFileChangeListener Hook 来监听文件变化
    const { rebuildData, preparing, needAuth } = useRebuildData(userConfig, directoryHandle,)
    const { typeCount } = useLoadDataCount({ graph: userConfig.currentGraph, preparing, fileModified: Math.round(fileModified / 1 * 60 * 60 * 1000) }); // 每小时尝试刷新一次

    const tabData = useTabData(userConfig.preferredLanguage)
    const [currentTab, setCurrentTab] = useState(tabData[0].key);
    const [searchValue, setSearchValue] = useState<string>('');
    const [mode, setMode] = useState<DisplayMode>(DisplayMode.LIST); // 默认为列表模式
    const tabContentRef = useRef<HTMLDivElement>(null);
    const calBatchSize = () => (DisplayMode.isCard(mode) ? 40 : 20)
    const [maxNumber, setMaxNumber] = useState<number>(calBatchSize);
    const { loadMore, scrollPosition } = useUpdateMaxNumberOnScroll(calBatchSize(), maxNumber, typeCount[currentTab as TabEnum], setMaxNumber)(tabContentRef)
    const { data, loading } = useLoadData({
        graph: userConfig.currentGraph, // 假设有一个默认图 
        maxNumber, //  根据滚动轴，调整maxCardNumber数量
        dataType: TabEnum.toDataType((currentTab as TabEnum)),
        searchValue, //检索词
        loadMore,
        preparing,
        fileModified
    });
    const [theme] = useTheme(userConfig.preferredThemeMode)
    const { width, height, left, top } = useComponentSizeAndPosition()
    const listHeight = useCalculateHeight(40, height); // 使用自定义钩子计算高度


    const handleTabClick = (tabKey: string) => {
        setCurrentTab(tabKey);
        setMaxNumber(calBatchSize())
    };

    const onSearch: SearchProps['onSearch'] = (value, _e, _info) => { setSearchValue(value) };

    const toggleMode = () => {
        setMode((prevMode) => {
            switch (prevMode) {
                case DisplayMode.CARD:
                    return DisplayMode.LIST;
                case DisplayMode.LIST:
                    return DisplayMode.TABLE;
                case DisplayMode.TABLE:
                default:
                    return DisplayMode.LIST;
            }
        });
    };
    const viewLog = async () => { await initLogCfg(); logseq.App.pushState('page', { name: LOG_PAGE }) };

    const actions: ActionItemProps[] = [
        {
            icon: ArrowsClockwise,
            text: getI18nConstant(userConfig.preferredLanguage, i18n_REBUILD_DATA),
            onClick: () => { rebuildData(true); }
        }, {
            icon: mode === DisplayMode.CARD ? SquaresFour :
                mode === DisplayMode.LIST ? List : Table,
            text: mode === DisplayMode.CARD ? getI18nConstant(userConfig.preferredLanguage, i18n_VIEW_LIST_MODE) :
                mode === DisplayMode.LIST ? getI18nConstant(userConfig.preferredLanguage, i18n_VIEW_CARD_MODE) :
                    getI18nConstant(userConfig.preferredLanguage, i18n_VIEW_TABLE_MODE),
            onClick: toggleMode
        }, {
            icon: Newspaper,
            text: getI18nConstant(userConfig.preferredLanguage, i18n_LOG_TOOLTIP),
            onClick: viewLog
        }
    ]



    return (
        <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
            <ConfigProvider
                theme={{
                    // algorithm: AntdTheme.defaultAlgorithm,
                    token: {
                        colorFill: `var(--ls-primary-background-color, var(--ls-primary-background-color-plugin))`,
                        colorFillSecondary: `var(--ls-secondary-background-color, var(--ls-secondary-background-color-plugin))`,
                        colorBgBase: theme === 'dark' ? `var(--ls-secondary-background-color, var(--ls-secondary-background-color-plugin))` : "",
                        colorTextBase: `var(--ls-primary-text-color, var(--ls-primary-text-color-plugin))`,
                        colorTextSecondary: `var(--ls-secondary-text-color, var(--ls-secondary-text-color-plugin))`,
                    },
                    components: {
                        Tabs: {
                            cardBg: `var(--ls-primary-background-color, var(--ls-primary-background-color-plugin))`,
                            itemColor: `var(--ls-primary-text-color, var(--ls-primary-text-color-plugin))`,
                        },
                        Dropdown: {
                            colorText: `var(--ls-secondary-text-color, var(--ls-secondary-text-color-plugin))`,
                            controlItemBgHover: `var(--ls-secondary-background-color, var(--ls-secondary-background-color-plugin))`,
                        },
                    }
                }}
            >
                <div
                    className='fm-container'
                    style={{
                        width: width,
                        height: height,
                        left: left,
                        top: top,
                        position: 'relative',
                        backgroundColor: `var(--ls-primary-background-color, var(--ls-primary-background-color-plugin))`,
                        color: `var(--ls-primary-text-color, var(--ls-primary-text-color-plugin))`,
                        transition: 'background-color 0.3s, color 0.3s',
                    }}>
                    <div style={{ padding: 20, paddingBottom: 40 }}>
                        <Tabs
                            searchAction={<Search placeholder={getI18nConstant(userConfig.preferredLanguage, i18n_SEARCH_PLACEHOLDER)} onSearch={onSearch} allowClear />}
                            tabData={tabData}
                            onTabClick={handleTabClick}
                            tabCounts={typeCount}
                            actions={actions}
                            appWidth={width}
                            theme={theme} />

                        <div className='tab-content' ref={tabContentRef} style={{
                            maxHeight: listHeight, // 设置最大高度
                            minHeight: height - 100,
                            overflow: 'auto', // 启用滚动
                        }} >
                            {
                                needAuth ?
                                    <Result
                                        title={`${getI18nConstant(userConfig.preferredLanguage, i18n_AUTHORIZE_TOOLTIP)} ${getI18nConstant(userConfig.preferredLanguage, i18n_AUTHORIZE_TOOLTIP_PATH)}:${buildGraphPath(userConfig.currentGraph)}`}
                                        extra={<Button icon={<FolderSimplePlus />} onClick={() => getDirectoryHandle()} type="default">{getI18nConstant(userConfig.preferredLanguage, i18n_AUTHORIZE)}</Button>}
                                    />
                                    : <Spin spinning={preparing} tip={getI18nConstant(userConfig.preferredLanguage, i18n_BUILDING)} percent='auto' delay={100}>
                                        {mode ?
                                            <div className="p-4">
                                                <VirtualTable
                                                    data={data}
                                                    columns={tableColumns}
                                                    rowHeight={48}
                                                    onSettingsChange={(settings: TableSettings) => { console.log(settings) }}
                                                />
                                            </div>
                                            :
                                            <ProList
                                                data={data}
                                                mode={mode}
                                                userConfig={userConfig}
                                                size={{ width, height }}
                                                emptyNode={<Empty />}
                                                loading={loading}
                                                dirhandler={getDirectoryHandle}
                                                scrollPosition={scrollPosition}
                                            />
                                        }
                                    </Spin>
                            }

                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
};

export default App;

