import { useState, useEffect } from 'react';
import { PARENT_MAIN_CONTAINER_ID } from '../data/constants';

const useComponentSizeAndPosition = () => {
    const [sizeAndPosition, setSizeAndPosition] = useState({ width: innerWidth, height: innerHeight, left: 0, top: 0 });

    useEffect(() => {
        const mainContainer = parent.document.getElementById(PARENT_MAIN_CONTAINER_ID);

        const updateSizeAndPosition = () => {
            if (mainContainer) {
                const rect = mainContainer.getBoundingClientRect();
                setSizeAndPosition({
                    width: rect.width,
                    height: rect.height,
                    left: rect.x,
                    top: rect.top,
                });

            }
        };

        const resizeObserver = new ResizeObserver(updateSizeAndPosition);// 创建 ResizeObserver 实例
        if (mainContainer) resizeObserver.observe(mainContainer); // 观察元素的大小变化
        updateSizeAndPosition(); // 初始计算

        return () => {
            resizeObserver.disconnect(); // 清理观察者
        };

    }, []);

    return sizeAndPosition;
};

export default useComponentSizeAndPosition;

