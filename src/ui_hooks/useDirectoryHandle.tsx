import { useState, useEffect } from "react";
import { i18n_AUTHORIZE_TOOLTIP, i18n_AUTHORIZE_TOOLTIP_PATH } from "../data/constants";
import getI18nConstant from "../i18n/utils";
import { buildGraphPath } from "../logseq/utils";
import { getGraphDirName } from "../utils/fileUtil";
import { logger } from "../utils/logger";


// 定义一个文件句柄钩子
export const useDirectoryHandle = ({ graph }: { graph: string; }) => {
    const [directoryHandle, setDirectoryHandle] = useState<any>(null);

    async function initializeDirectory() {
        if (graph) {
            const handle = await window.showDirectoryPicker().catch(e => {
                logger.warn('get directory failed,', e)
            });
            logger.debug(`initializeDirectory, handle: ${handle?.name}`);
            if (!handle) {
                return;
            }

            if (handle.name === getGraphDirName(graph)) {
                setDirectoryHandle(handle);
            } else {
                logseq.UI.showMsg(`${getI18nConstant('en', i18n_AUTHORIZE_TOOLTIP)},${getI18nConstant('en', i18n_AUTHORIZE_TOOLTIP_PATH)}:${buildGraphPath(graph)}`, 'error', { timeout: 3000 });
            }
        }
    }

    useEffect(() => {
        initializeDirectory();
    }, [graph]);

    return { directoryHandle, initializeDirectory };
};
