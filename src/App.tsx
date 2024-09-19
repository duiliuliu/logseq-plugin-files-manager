// src/App.tsx
import React, { useRef, useState } from 'react';
import Tabs from './components/tabs';
import { Empty, GetProps, Input, Spin } from 'antd';
import { ActionItemProps } from './components/actionItem';
import { ArrowsClockwise, RowsPlusBottom, SquaresFour } from '@phosphor-icons/react';
import Search from 'antd/es/input/Search';
import { useSize } from 'ahooks';
import { logger } from './utils/logger';
import { useUpdateMaxNumberOnScroll } from './utils/useUpdateNumberOnScroll';
import { DisplayMode, DocFormat, TabEnum } from './data/enums';
import ProList from './components/proList';
import { useLoadData } from './data/useLoadData';
import { useRebuildData } from './data/useRebuildData';
import { useLoadDataCount } from './data/useLoadDataCount';
import useCalculateHeight from './utils/useCalculateHeight';
import { PARENT_MAIN_CONTAINER_ID, i18n_BUILDING, i18n_REBUILD_DATA, i18n_SEARCH_PLACEHOLDER, i18n_VIEW_CARD_MODE, i18n_VIEW_LIST_MODE, } from './data/constants';
import { useFileChangeListener } from './data/useFileChangeListener';
import { useDirectoryHandle } from './utils/fileUtil';
import getI18nConstant from './i18n/utils';
import { useUserConfigs } from './logseq/useUserConfigs';
import useTabData from './data/useTabData';
import useTheme from './data/useLoadTheme';

type SearchProps = GetProps<typeof Input.Search>;

const App: React.FC = () => {
    const userConfig = useUserConfigs();
    const tabData = useTabData(userConfig.preferredLanguage)
    const [currentTab, setCurrentTab] = useState(tabData[0].key);
    const [searchValue, setSearchValue] = useState<string>('');
    const [mode, setMode] = useState<DisplayMode>(DisplayMode.LIST); // 默认为列表模式
    const tabContentRef = useRef<HTMLDivElement>(null);
    const bodySize = useSize(parent.document.getElementById(PARENT_MAIN_CONTAINER_ID))
    const { typeCount } = useLoadDataCount({ graph: userConfig.currentGraph });
    const { directoryHandle } = useDirectoryHandle({ graph: userConfig.currentGraph })
    const listHeight = useCalculateHeight(40); // 使用自定义钩子计算高度
    const calBatchSize = () => (DisplayMode.isCard(mode) ? 40 : 20)
    const [maxNumber, setMaxNumber] = useState<number>(calBatchSize);
    const loadMore = useUpdateMaxNumberOnScroll(calBatchSize(), maxNumber, typeCount[currentTab as TabEnum], setMaxNumber)(tabContentRef)
    const { data, loading } = useLoadData({
        graph: userConfig.currentGraph, // 假设有一个默认图 
        maxNumber, //  根据滚动轴，调整maxCardNumber数量
        dataType: TabEnum.toDataType((currentTab as TabEnum)),
        searchValue, //检索词
        loadMore
    });
    const [theme] = useTheme(userConfig.preferredThemeMode)

    useFileChangeListener(userConfig)   // 使用 useFileChangeListener Hook 来监听文件变化

    const { rebuildData, preparing } = useRebuildData(userConfig.currentGraph, directoryHandle, userConfig.preferredFormat as DocFormat)

    const handleTabClick = (tabKey: string) => {
        logger.debug(`handleTabClick, tabKey:${tabKey}`)
        setCurrentTab(tabKey);
        setMaxNumber(calBatchSize())
    };

    const onSearch: SearchProps['onSearch'] = (value, _e, _info) => {
        logger.debug('onSearch')
        setSearchValue(value)
    };

    const toggleMode = () => {
        logger.debug('toggleMode')
        setMode((prevMode) => (DisplayMode.isCard(prevMode) ? DisplayMode.LIST : DisplayMode.CARD));
    };

    const actions: ActionItemProps[] = [
        {
            icon: ArrowsClockwise,
            text: getI18nConstant(userConfig.preferredLanguage, i18n_REBUILD_DATA),
            onClick: () => { rebuildData(true) }
        }, {
            icon: DisplayMode.isCard(mode) ? RowsPlusBottom : SquaresFour,
            text: DisplayMode.isCard(mode) ? getI18nConstant(userConfig.preferredLanguage, i18n_VIEW_LIST_MODE) : getI18nConstant(userConfig.preferredLanguage, i18n_VIEW_CARD_MODE),
            onClick: toggleMode
        }
    ]

    return (
        <div className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
            <div
                className='fm-container'
                style={{
                    width: bodySize?.width ? bodySize?.width : '90%',
                    height: bodySize?.height ? bodySize?.height : '94%',
                    marginBlock: 80,
                    float: 'right',
                    backgroundColor: `var(--ls-primary-background-color)`,
                    color: `var(--ls-primary-text-color)`,
                    transition: 'background-color 0.3s, color 0.3s',
                }}>
                <div style={{ padding: 20, paddingBottom: 40 }}>
                    <Tabs
                        searchAction={<Search placeholder={getI18nConstant(userConfig.preferredLanguage, i18n_SEARCH_PLACEHOLDER)} onSearch={onSearch} allowClear />}
                        tabData={tabData}
                        onTabClick={handleTabClick}
                        tabCounts={typeCount}
                        actions={actions}
                        appWidth={bodySize?.width} />

                    <div className='tab-content' ref={tabContentRef} style={{
                        maxHeight: listHeight, // 设置最大高度
                        overflow: 'auto', // 启用滚动
                    }} >
                        <Spin spinning={preparing} tip={getI18nConstant(userConfig.preferredLanguage, i18n_BUILDING)} percent='auto' >
                            <ProList
                                data={data}
                                mode={mode}
                                userConfig={userConfig}
                                size={bodySize}
                                emptyNode={<Empty />}
                                loading={loading}
                            />
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
