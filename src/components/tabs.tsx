// src/components/Tabs.tsx
import React, { useState } from 'react';
import './tabs.css'; // 引入样式文件
import { Tabs as AntdTabs, } from 'antd';
import TabItem from './tabItem';
import { ActionItemProps } from './actionItem';
import ActionList from './actionList';
import { Tab } from '../data/types';
import { TabEnum } from '../data/enums';

interface TabsProps {
  tabData: Tab[],
  onTabClick: (tabId: string) => void;
  tabCounts?: { [key: string]: number }; // 新增计数参数
  appWidth?: number;
  actions?: ActionItemProps[];
  searchAction?: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ tabData, onTabClick, tabCounts, appWidth, actions, searchAction: searchAction }) => {
  const [activeKey, setActiveKey] = useState<string>(tabData[0].key);
  const iconOnly = (appWidth && appWidth < 768) as boolean
  const [settingOpen, setSettingOpen] = useState<boolean>(false);
  const handleTabClick = (tabKey: string) => {
    if (TabEnum.isSettingsTab(tabKey)) {
      setSettingOpen(!settingOpen)
    } else {
      setActiveKey(tabKey);
      onTabClick(tabKey);
      setSettingOpen(false)
    }
  };

  return (
    <AntdTabs
      tabBarExtraContent={{ right: searchAction }}
      tabPosition='top'
      size='middle'
      defaultActiveKey={tabData[0].key}
      items={tabData.map(item => (
        {
          key: item.key,
          label: TabEnum.isSettingsTab(item.key) && actions ?
            (
              <ActionList
                actions={actions}
                open={settingOpen}
                tabItem={<TabItem item={item} iconOnly={iconOnly} activeKey={activeKey} tabCounts={tabCounts} />}
              />
            )
            :
            <TabItem item={item} iconOnly={iconOnly} activeKey={activeKey} tabCounts={tabCounts} />
        }
      ))} onTabClick={handleTabClick} />
  )
};

export default Tabs;