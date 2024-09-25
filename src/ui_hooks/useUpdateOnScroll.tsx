// src/utils/useUpdateNumberOnScroll.tsx

import React, { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { PARENT_BACK_BOTTOM, PARENT_BACK_TOP } from '../data/constants';

// 工具方法，用于加载更多数据当滚动到底部
export const useUpdateMaxNumberOnScroll = (growth: number, currentMaxNumber: number, dataSize: number, setMaxNumber: { (value: React.SetStateAction<number>): void; (arg0: (prevMaxNumber: number) => number): void; }) => {
    const [loadMore, setLoadMore] = useState<boolean>(false);

    const handleScroll = (element?: HTMLElement) => {
        if (dataSize == 0) {
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
                const backTop = parent.document.getElementsByClassName(PARENT_BACK_TOP).item(0) as HTMLElement;
                const backBottom = parent.document.getElementsByClassName(PARENT_BACK_BOTTOM).item(0) as HTMLElement;;

                // 处理滚动的函数
                const doHandleScroll = () => {
                    handleScroll(refEL?.current!);
                    backTop && (backTop.style.display = 'block');
                    backTop && (backTop.style.opacity = '0.7');
                    backBottom && (backBottom.style.display = 'block')
                    backBottom && (backBottom.style.display = '0.7')
                };
                // 滚动到顶部的函数
                const scrollTop = () => {
                    refEL.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    backTop && (backTop.style.display = 'none');
                }
                // 滚动到底部的函数
                const scrollBottom = () => {
                    refEL.current?.scrollTo({ top: refEL.current.scrollHeight - refEL.current.clientHeight - 20, behavior: 'smooth' })
                    setLoadMore(true)
                }

                // 添加事件监听器 
                refEL.current.addEventListener('scroll', doHandleScroll);
                backTop?.addEventListener('click', scrollTop);
                backBottom?.addEventListener('click', scrollBottom);

                return () => {
                    refEL?.current?.removeEventListener('scroll', doHandleScroll);
                    backTop?.removeEventListener('click', scrollTop);
                    backBottom?.removeEventListener('click', scrollBottom);
                };
            }
        }, [growth, currentMaxNumber, dataSize]); // 仅在 growth 或 dataSize 变化时重新绑定事件

        return loadMore;
    };
};

// 判断是否滚动到底部
const isScrolledToBottom = (element?: HTMLElement) => {
    if (element) {
        const res = element.scrollTop + element.clientHeight + 10 >= element.scrollHeight
        logger.debug(`isScrolledToBottom,result:${res},element.scrollTop:${element.scrollTop},element.clientHeight:${element.clientHeight},element.scrollHeight:${element.scrollHeight}`)
        return res;
    }
};