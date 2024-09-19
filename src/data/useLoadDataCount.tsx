import { DB } from './db';
import { DataType, TabEnum } from './enums';
import { logger } from '../utils/logger';
import { useState, useEffect } from 'react';

// 定义一个类型，包含所有数据类型和额外的 'all' 属性
export type DataTypeCounts = {
    [K in TabEnum]: number;
};

// useDataTypeCount 钩子函数
export const useLoadDataCount = ({ graph }: { graph: string }) => {
    const [typeCount, setTypeCount] = useState<DataTypeCounts>({} as DataTypeCounts);
    const [countLoading, setCountLoading] = useState(true);

    useEffect(() => {
        const fetchTypeCount = async () => {
            try {
                setCountLoading(true);
                const counts = await getDataTypesCount(graph);
                setTypeCount(counts);
            } catch (error) {
                logger.error('Failed to load type count:', error);
            } finally {
                setCountLoading(false);
            }
        };

        fetchTypeCount();
    }, [graph]);

    return { typeCount, countLoading };
};


// 定义一个函数来获取数据类型计数
const getDataTypesCount = async (graph: string): Promise<DataTypeCounts> => {
    logger.debug(`getDataTypesCount start - graph: ${graph}`);
    const counts: DataTypeCounts = {} as DataTypeCounts

    try {
        // 获取总数
        const totalCount = await DB.data.where('graph').equals(graph).count();
        counts.all = totalCount;

        // 获取每种数据类型的计数
        await DB.data.where('graph').equals(graph).each((item) => {
            const dataType = item.dataType;
            const tabKey = DataType.toTabEnum(dataType)
             if (dataType && tabKey) {
                counts[tabKey] = (counts[tabKey] || 0) + 1;
            }
        });
    } catch (error) {
        logger.warn('Failed to get data types count:', error);
        throw error; // 重新抛出错误，可以在调用此函数的地方进行处理
    } finally {
        logger.debug(`getDataTypesCount end - graph: ${graph}`);
    }
    return counts;
};
