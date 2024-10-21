import { AppConfig, createMetaBlockProps } from "../../data/types";
import { logger } from "../../utils/logger"
import { getCustomVariables, resolveProperties, resolveProperty, selectedOffset, selectedText } from "./logseqCustomVariable";


/**
 * 需配合插件 logseq-plugin-wrap 使用
 * 1. 注解快、脚注、评论；
 * 2. 在当前页面底部添加注解快、脚注、评论
 * 3. 有下面两种方式可选配置添加
 *      3.1 页面底部，配置指定的父快，在父块下面添加
 *      3.2 页面底部，内容统一添加指定标签
 *      3.3 是否需要属性
 */
export const initMetaBlock = (appConfig: AppConfig) => {
    const metaBlockCustomsCommandConfig = appConfig?.pluginSettings?.metaBlockCustomsCommandConfig

    const createMetaBlock = async (params: createMetaBlockProps) => {
        logger.debug('createMetaBlock start')

        const props: createMetaBlockProps = {
            parentBlock: params.parentBlock,
            parentBlockProperties: { ...params.parentBlockProperties },
            metaBlockPrefix: params.metaBlockPrefix,
            metaBlockProperties: { ...params.metaBlockProperties }
        }

        let pageE = await logseq.Editor.getCurrentPage()
        const currentBlock = await logseq.Editor.getCurrentBlock()
        if (!pageE) {
            currentBlock?.page && (pageE = await logseq.Editor.getPage(currentBlock?.page.id))
            if (!pageE) {
                logger.debug('pageE is nil')
                return
            }
        }
        let varsData = await getCustomVariables({ appConfig, page: pageE })

        // @ts-ignore
        let parenetBlock;
        if (props.parentBlock != '') {
            props.parentBlock = await resolveProperty(props.parentBlock, varsData, appConfig.pluginSettings?.customVariableTimeout, appConfig.pluginSettings?.customVariableErrorHandler)

            const pageBlocks = await logseq.Editor.getPageBlocksTree(pageE?.originalName)
            for (const block of pageBlocks) {
                if (block.content.includes(props.parentBlock) && block.content.startsWith(props.parentBlock)) {
                    parenetBlock = block
                    break
                }
            }
            if (!parenetBlock) {
                props.parentBlockProperties = await resolveProperties(props.parentBlockProperties, varsData, appConfig.pluginSettings?.customVariableTimeout, appConfig.pluginSettings?.customVariableErrorHandler)
                parenetBlock = await logseq.Editor.appendBlockInPage(pageE?.originalName, props.parentBlock, props.parentBlockProperties)
            }

            // @ts-ignore
            varsData.parentBlockChildNum = (parenetBlock?.children?.length || 0) + 1
        }

        props.metaBlockPrefix && (props.metaBlockPrefix = await resolveProperty(props.metaBlockPrefix, varsData, appConfig.pluginSettings?.customVariableTimeout, appConfig.pluginSettings?.customVariableErrorHandler))
        props.metaBlockProperties && (props.metaBlockProperties = await resolveProperties(props.metaBlockProperties, varsData, appConfig.pluginSettings?.customVariableTimeout, appConfig.pluginSettings?.customVariableErrorHandler))
        const resBlock = await logseq.Editor.insertBlock(parenetBlock?.uuid || pageE?.uuid, props.metaBlockPrefix, {
            properties: props.metaBlockProperties,
            sibling: false,
            before: false,
        })
        pageE && currentBlock && logseq.Editor.scrollToBlockInPage(pageE.originalName, currentBlock?.uuid)
        resBlock && logseq.Editor.openInRightSidebar(resBlock?.uuid)

        const annotateReg = new RegExp(`\\\[\\\^(.*?)\\\]`)
        const annotateMatch = props.metaBlockPrefix.match(annotateReg)
        if (annotateMatch && currentBlock) {
            const selector = selectedText()
            const selectorOffset = selectedOffset()
            if (selector) {
                setTimeout(async () => {
                    const selectorLinkReg = new RegExp(`\\\[${selector}\\\]\\\(.*?\\\)\\\)\\\)|${selector}`);
                    // const selectorReg = new RegExp(`(${selector}`, 'g');
                    const updateBlock = await logseq.Editor.getBlock(currentBlock?.uuid)              // @ts-ignore
                    if (!updateBlock) return
                    // 替换逻辑 
                    const newContent = updateBlock?.content.replace(selectorLinkReg, (match, offset) => {
                        // @ts-ignore
                        return offset === selectorOffset ? `${match}[^${annotateMatch[1]}]` : match
                    });
                    updateBlock && newContent && logseq.Editor.updateBlock(currentBlock?.uuid, newContent)
                    logger.debug('updateBlock', updateBlock, newContent)
                }, 3000);
            }
        }

        logger.debug('createMetaBlock end', resBlock?.uuid)
        return resBlock?.uuid
    }

    const objs = {}
    metaBlockCustomsCommandConfig && Object.entries(metaBlockCustomsCommandConfig).forEach(([key, value]) => {
        //@ts-ignore
        objs[key] = async () => { return await createMetaBlock(value) }
    })

    logseq.provideModel({ ...objs, createMetaBlock })

    return objs && Object.keys(objs).length > 0 && Object.keys(objs).map(key => `${logseq.baseInfo.id}.models.${key}`).reduce((prev, curr) => prev + ', ' + curr)
}

