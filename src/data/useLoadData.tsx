import { useEffect, useState } from 'react';
import { DataItem } from './types';
import { DB } from './db';
import { logger } from '../utils/logger';
import { DataType } from './enums';

interface UseDataProps {
    graph: string;
    maxNumber: number;
    dataType: DataType;
    searchValue?: string; //检索词
    loadMore?: boolean;
    preparing: boolean;
    fileModified: number;
}

// useLoadData 钩子函数
export const useLoadData = ({ graph, maxNumber, dataType, searchValue, loadMore, preparing, fileModified }: UseDataProps) => {
    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            logger.debug(`fetchData start - graph: ${graph}, maxNumber: ${maxNumber}, searchValue: ${searchValue}`);
            try {
                setLoading(true); // 开始加载数据前设置 loading 为 true
                const newData = await doLoadData(graph, loadMore ? data.length : 0, maxNumber, dataType, searchValue);
                if (loadMore) {
                    logger.debug(`loadMore`)
                    setData(preData => preData.concat(newData)); // 设置数据
                } else {
                    setData(newData); // 设置数据
                }
                logger.debug(`fetchData success - graph: ${graph}, data length: ${newData.length}`);
            } catch (error) {
                if (error instanceof TypeError) {
                    logger.warn('Failed to load data:', (error as TypeError).message);
                } else {
                    logger.error('Failed to load data:', error);
                    throw error; // 重新抛出错误，可以在调用此函数的地方进行处理
                }
            } finally {
                setLoading(false); // 无论成功或失败，加载结束后设置 loading 为 false
                logger.debug(`fetchData end - graph: ${graph}, loading: ${loading}`);
            }
        };

        fetchData();
    }, [graph, maxNumber, dataType, searchValue, preparing, fileModified]); // 依赖项列表

    return { data, loading };
};

export const doLoadData = async (graph: string, offset: number, limit: number, dataType: DataType, searchValue?: string): Promise<DataItem[]> => {
    logger.debug(`doLoadData start - graph: ${graph},offset:${offset}, limit: ${limit}, searchValue: ${searchValue}`);

    const data = await DB.data
        // .where( { graph, dataType } )
        .where(DataType.isDataType(dataType) ? { graph, dataType } : { graph })
        .and(item => { // 如果有搜索值，检查名称或摘要是否包含该值
            if (searchValue) {
                // 检查名称是否匹配
                if (item.name.includes(searchValue)) return true;
                if (item.alias.includes(searchValue)) return true;
                // 如果有摘要，检查每一项摘要是否匹配
                if (item.summary?.some(summaryRow => summaryRow.includes(searchValue))) return true;

                return false
            }
            return true;
        })
        .reverse()
        .offset(offset)
        .limit(limit)
        .sortBy('updatedTime');


    logger.debug(`doLoadData end - graph: ${graph}, data length: ${data.length}`);
    return data;
};
