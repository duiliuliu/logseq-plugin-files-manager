// src/utils/useUpdateNumberOnScroll.tsx

import React, { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
 
// 工具方法，用于加载更多数据当滚动到底部
export const useUpdateMaxNumberOnScroll = (growth: number, currentMaxNumber: number, dataSize: number, setMaxNumber: { (value: React.SetStateAction<number>): void; (arg0: (prevMaxNumber: number) => number): void; }) => {
    const [loadMore, setLoadMore] = useState<boolean>(false);

    const handleScroll = (element?: HTMLElement) => {
        if (dataSize == 0 ){
            dataSize = 1000
        }
        // 只有在当前最大数量等于数据大小时才增加 maxNumber
        logger.debug(`handleScroll add maxNumber,maxNumber:${currentMaxNumber},growth:${growth},dataSize:${dataSize}`)
        if (isScrolledToBottom(element) && currentMaxNumber <= dataSize) {
            setMaxNumber((prevMaxNumber: number) => prevMaxNumber + growth);
            setLoadMore(true)
            logger.debug(`handleScroll do add maxNumber,maxNumber:${currentMaxNumber}`)
        } else {
            setLoadMore(false)
        }
    };

    return (refEL: React.RefObject<HTMLElement>) => {
        useEffect(() => {
            if (refEL.current) {
                const doHandleScroll = () => {
                    logger.debug('doHandleScroll')
                    handleScroll(refEL?.current!);
                };
                refEL.current.addEventListener('scroll', doHandleScroll);
                return () => {
                    refEL?.current?.removeEventListener('scroll', doHandleScroll);
                };
            }
        }, [growth, currentMaxNumber, dataSize]); // 仅在 growth 或 dataSize 变化时重新绑定事件

        return loadMore;
    };
};

// 判断是否滚动到底部
const isScrolledToBottom = (element?: HTMLElement) => {
    if (element) {
        const res = element.scrollTop + element.clientHeight >= element.scrollHeight
        logger.debug(`isScrolledToBottom,result:${res},element.scrollTop:${element.scrollTop},element.clientHeight:${element.clientHeight},element.scrollHeight:${element.scrollHeight}`)
        return res;
    }
};