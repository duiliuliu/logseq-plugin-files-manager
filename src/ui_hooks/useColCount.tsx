// src/utils/useColCount.tsx

import { useState, useEffect } from 'react';

// 创建一个自定义钩子 useColumnCount
const useColumnCount = (containerWidth?: number) => {
    const [colCount, setColCount] = useState(() => getColumnCount(containerWidth));

    useEffect(() => {
        // 定义一个函数来根据容器宽度设置列数
        const setColumnsBasedOnWidth = () => {
            setColCount(getColumnCount(containerWidth));
        };

        // 初始调用
        setColumnsBasedOnWidth();

    }, [containerWidth]);

    return colCount;
};

// 根据容器宽度计算列数
function getColumnCount(containerWidth?: number) {
    if (!containerWidth) {
        // 定义一个函数来根据屏幕宽度设置列数
        if (window.innerWidth >= 1200) {
            return 8
        } else if (window.innerWidth >= 768) {
            return 4
        } else {
            return 2
        }
    }
    const columnWidthIncludingGutter = 160; // 每列的宽度（175内容 + 8*2边距）
    const colCount = Math.floor((containerWidth - 8) / columnWidthIncludingGutter); // 减去一个间隙宽度
    return colCount < 1 ? 1 : colCount; // 至少保证有一列
}

export default useColumnCount;