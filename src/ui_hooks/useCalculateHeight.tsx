// src/utils/useCalculateHeight.tsx
import { useEffect, useState } from 'react';

/**
 * useCalculateHeight 自定义Hook用于计算并返回列表的高度。
 * 它基于屏幕高度和头部偏移量来动态计算列表的高度，并确保列表的最小高度为400px。
 *
 * @param headerOffset 头部偏移量，默认值为100。
 * @returns 计算后的列表高度。
 */
const useCalculateHeight = (headerOffset: number = 100, bodyHeight: number = window.innerHeight) => {
  const [listHeight, setListHeight] = useState<number>(500); // 默认高度

  useEffect(() => {
    /**
    * 计算高度的函数。
    * 它根据屏幕高度和头部偏移量来计算列表的可用高度，并设置列表的高度。
    * 如果计算出的高度小于400px，则将列表高度设置为400px。
    */
    const calculateHeight = () => {
      const availableHeight = bodyHeight - headerOffset;
      setListHeight(availableHeight > 400 ? availableHeight : 400); // 确保最小高度为400px
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, [headerOffset]);

  return listHeight;
};

export default useCalculateHeight;