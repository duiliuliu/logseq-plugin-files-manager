import { useCallback, useEffect, useState } from 'react';
import { logger } from '../utils/logger';
import { DB } from './db';
import { DocFormat } from './enums';
import { prepareAssetsData, preparePagesData } from './prepareData';
import { renderAuthoItem3 } from '../components/authorItem';


export const useRebuildData = (graph: string, dirHandle: any, docFormat: DocFormat, lang?: string) => {
    // 将状态变量从 loading 改为 preparing
    const [preparing, setPreparing] = useState(false); // 追踪重建操作的进行状态
    const [needAuth, setNeedAuth] = useState(false); // 需要授权 

    const rebuildData = useCallback(async (doRebuild?: boolean) => {
        logger.debug(`rebuildDB start, graph: ${graph}, docFormat: ${docFormat}, dirHandle: ${dirHandle}`);
        setPreparing(true); // 重建开始时设置preparing为true

        if (!graph) {
            setPreparing(false); // 如果graph为空，则立即设置preparing为false
            return;
        }

        try {
            if (doRebuild) {
                await DB.data.where('graph').equals(graph).delete();
            }

            const count = await DB.data.where('graph').equals(graph).count();
            if (count > 0) {
                // 如果数据库中已有数据，则不进行重建
                logger.debug(`rebuildDB end, due to count > 0, no need rebuild`);
                setPreparing(false); // 数据库已有数据，重建结束
                return;
            }

            if (!dirHandle) {
                setNeedAuth(true)
                !doRebuild && logseq.UI.showMsg(renderAuthoItem3(lang ?? 'en'), 'info', { timeout: 60000 })
                return
            }

            setNeedAuth(false);
            await prepareAssetsData({ graph }); // 先加载asset 
            await preparePagesData({ graph, dirHandle, docFormat });
        } catch (error) {
            logger.error('Failed to rebuild data:', error);
        } finally {
            setPreparing(false); // 无论成功或失败，重建结束后设置preparing为false
        }
    }, [graph, dirHandle, docFormat, lang]);

    useEffect(() => {
        rebuildData();
    }, [rebuildData]);

    // 返回rebuildDB函数和preparing状态
    return { rebuildData, preparing, needAuth };
};
