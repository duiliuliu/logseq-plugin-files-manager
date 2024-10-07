import { format } from "date-fns";
import { HOME_PAGE, LOG_PAGE } from "../../data/constants";
import { OperationType } from "../../data/enums";
import { AppConfig } from "../../data/types";


export const initLogCfg = async (back?: boolean) => {
    let logPage = await logseq.Editor.getPage(LOG_PAGE)
    if (!logPage || !logPage?.properties?.source) {
        const tempElement = document.createElement('span');
        tempElement.innerHTML = `&#xf021;`;
        logPage = await logseq.Editor.createPage('files-manager-log', {
            source: '[[files-manager]]',
            icon: tempElement.innerText,
        })
        logseq.Editor.appendBlockInPage(LOG_PAGE, ` query-sort-by:: date
                                                    query-sort-desc:: true
                                                    #+BEGIN_QUERY
                                                    {:title "All files operate log"
                                                    :query [:find (pull ?b [*])
                                                            :in $ ?current-page
                                                            :where
                                                            [?p :block/name ?current-page]
                                                            [?b :block/page ?p]
                                                            [?b :block/content ?content]
                                                            [(!= ?content "")]
                                                            ]
                                                    :inputs ["${HOME_PAGE}"]
                                                    :limit 10 ; 每页限制返回10条记录
                                                    :offset 0 ; 从第一条记录开始    
                                                    :table-view? false
                                                    }
                                                    #+END_QUERY
                                                    `)
        if (back) {
            logseq.App.pushState('page', { name: HOME_PAGE })
        }
    }

}

export interface opts {
    fileType: string,
    file: string,
    operate: OperationType
    [key: string]: any;
}

export const trace = async (userConfig: AppConfig, content: string, opts: opts) => {
    const now = Date.now()
    logseq.Editor.appendBlockInPage(HOME_PAGE, content, {
        properties: {
            date: `[[${format(now, userConfig.preferredDateFormat)}]]`,
            time: format(now, 'HH:mm'),
            ...opts
        }
    })
}