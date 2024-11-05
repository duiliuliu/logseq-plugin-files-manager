import { BookCardProps, getdefaultBookCardProps } from "@/components/feat/bookCard"
import { FoodCardProps, getdefaultFoodCardProps } from "@/components/feat/foodCard"
import { getdefaultRatingCardProps } from "@/components/feat/ratingCard"
import FlipCountDown, { countDownStyles, getdefaultFlipCountDownProps } from "@/components/feat/timeCountdown"
import CountdownTimer, { getdefaultCountdownTimerProps } from "@/components/feat/timeCountDown2"
import { AppConfig } from "@/data/types"
import { logger } from "@/utils/logger"
import { getDay, parse } from "date-fns"
import ReactDOM from "react-dom"
import { getGloableUserConfigs } from "../useUserConfigs"
import { propertiesToStr } from "./logseqDefaultPageProps"
import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin"
import { sleep } from "../logseqCommonProxy"
import React from "react"
import FlexibleLayout from "@/components/feat/flexibleLayout"
import { mockBlocks } from "@/mock/logseqBlocks"
import { ASSETS_PATH_REGEX, GRAPH_PREFIX } from "@/data/constants"
import { pageCardStyles, TodoItem } from "@/components/feat/pageCard"
import PageCard2 from "@/components/feat/pageCard2"
import Itinerary, { getdefaultItineraryProps } from "@/components/feat/itinerary"
import RatingCard2 from "@/components/feat/ratingCardEdit"
import BookCard2 from "@/components/feat/bookCardEdit"
import ExpenseCard from "@/components/feat/expenseCardEdit"
import { ExpenseCardProps, getdefaultExpenseCardProps } from "@/components/feat/expenseCard"
import TrainTicket from "@/components/feat/trainTicketEdit"
import { getdefaultTrainTicketProps, TrainTicketProps } from "@/components/feat/trainTicket"
import FlightTicket from "@/components/feat/flightticketEdit"
import { FlightTicketProps, getdefaultFilghtTicketProps } from "@/components/feat/flightTicket"
import FlightTicket2 from "@/components/feat/flightTicketEdit2"
import FoodCard from "@/components/feat/foodCardEditor"
import MovieCard, { getdefaultMovieCardProps, MovieCardProps } from "@/components/feat/movieCard"
import PageCardPro from "@/components/feat/pageCardPro"
import { getPageTodos2 } from "./logseqGetTODOs"

const hiddenBlockCardProp = (blockUid: string) => {
    logger.debug('hiddenBlockCardProp', blockUid)
    const block = parent?.document?.getElementById(`block-content-${blockUid}`)
    const propsDiv = block?.querySelector("div.block-properties.rounded") as HTMLDivElement
    propsDiv && (propsDiv.className = 'hidden')
}

const tryGetElement = async (id: string, times?: number): Promise<HTMLElement | null> => {
    if (!times) {
        times = 5
    }
    for (let index = 0; index < times; index++) {
        await sleep(20 * index + 1)
        const mydiv = parent?.document?.getElementById(id)
        if (mydiv) { return mydiv }
    }
    return null
}

const tryGetBlockOtrherElement = (version: string, cardType: string, blockE: BlockEntity, hiddenBlockCardProps?: boolean) => {
    if (version === 'v1') {
        return blockE?.content.replace(/{{renderer .*}}/g, '').replace(/\w+::.*/g, '') || ''
    }
    if (version === ' v2') {


        const blockUid = blockE.uuid
        const blockClone = parent?.document?.getElementById(`block-content-${blockUid}`)?.cloneNode(true) as HTMLDivElement
        // 删除指定的子节点
        if (blockClone) {
            blockClone.id = 'clone-' + blockClone.id
            const cardElement = blockClone.querySelector(`#${cardType}-${blockUid}`);
            cardElement && cardElement.remove();
        }
        if (hiddenBlockCardProps) {
            const propsDiv = blockClone?.querySelector("div.block-properties.rounded") as HTMLDivElement
            propsDiv && (propsDiv.className = 'hidden')
        }

        if (blockClone) {
            return ReactDOM.createPortal(
                <div>{/* 这里可以添加更多子元素 */}</div>,
                blockClone
            );
        }
    }
    return ''
}

const getPageInfo = async (pageName?: string) => {
    let pageE: PageEntity | null
    let todoList
    if (pageName) {
        pageName = pageName.replace('[[', '').replace(']]', '')
        pageE = await logseq.Editor.getPage(pageName.replace('[[', '').replace(']]', ''));
        todoList = await getPageTodos2(pageName)

    } else {
        pageE = (await logseq.Editor.getCurrentPage()) as PageEntity
    }
    return { pageE, todoList }
}

type PageInfo = { pageE: PageEntity | null, todoList: Array<TodoItem> | undefined }
type registeAndRenderMicroDomProps = {
    cardType: string,
    hiddenBlockCardProps: boolean | undefined,
    elementFunc: (blockE?: BlockEntity, pageinfo?: PageInfo) => React.ReactElement,
    defaultPropsFunc?: () => { [K: string]: any }
    renderType?: 'native' | 'reactive'
    pramTemps?: string[]
    styles?: string
}
type renderMicroParam = { [K: string]: any, block?: string, page?: string, display?: string, position?: string, }
const registeAndRenderMicroDom = ({ cardType, hiddenBlockCardProps, elementFunc, defaultPropsFunc, renderType = 'reactive', pramTemps = ['*'], styles }: registeAndRenderMicroDomProps) => {
    logger.debug('registeAndRenderMicroDom', { prefix: cardType, hiddenBlockCardProps, renderType })
    let slotContent = ` {{renderer :${cardType}, ${pramTemps.join(',')}}} `
    if (defaultPropsFunc) { slotContent += '\n' + propertiesToStr(defaultPropsFunc())[0] }
    logseq.Editor.registerSlashCommand(cardType, async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        logseq.Editor.updateBlock(block.uuid, block.content + slotContent)
    })

    logseq.App.onMacroRendererSlotted(async ({ slot, payload: { arguments: args, uuid } }) => {
        const id = cardType + '-' + uuid
        if (args?.[0].trim() != (':' + cardType)) { return }
        const params: renderMicroParam = args.reduce((acc, curr) => {
            const [key, value] = curr.trim().split(':');
            if (key && value) {
                //@ts-ignore
                value?.trim() != '*' && (acc[key] = value?.trim());
            }
            return acc;
        }, {});
        logger.debug('onMacroRendererSlotted-params', params)

        let blockE: BlockEntity | null
        let pageInfo: PageInfo = await getPageInfo(params.page);
        let wrapElementFunc = elementFunc
        if (params.block) { blockE = (await logseq.Editor.getBlock(params.block.replace('((', '').replace('))', ''))) } else { blockE = (await logseq.Editor.getBlock(uuid)) }
        if (params.display) {
            wrapElementFunc = (blockE?: BlockEntity, pageinfo?: PageInfo) => <FlexibleLayout
                text={blockE && tryGetBlockOtrherElement('v1', cardType, blockE, hiddenBlockCardProps)}
                media={elementFunc(blockE, pageinfo)}
                layout={(params.display as 'column' | 'row' | 'inline' | 'wrap' | 'float' | 'inlinetextbox')}
                imagePosition={params.position && params.position === 'right' ? 'right' : 'left'}
            />
        }
        let mydiv
        switch (renderType) {
            case 'reactive':
                logger.debug('registeAndRenderMicroDom-onMacroRendererSlotted-reactive')
                logseq.provideUI({ key: id, slot, reset: false, template: `<div id='${id}'></div>`, })
                mydiv = await tryGetElement(id, 5)
                // mydiv && ReactDOMCli.createRoot(mydiv!).render(wrapElementFunc(blockE || undefined, pageE || undefined))
                mydiv && ReactDOM.render(wrapElementFunc(blockE || undefined, pageInfo || undefined), mydiv);
                // showCardUI()
                break
            case 'native':
                logger.debug('registeAndRenderMicroDom-onMacroRendererSlotted-reactive')
                mydiv = document.createElement('div');
                mydiv && ReactDOM.render(wrapElementFunc(blockE || undefined, pageInfo || undefined), mydiv);
                logseq.provideUI({ key: id, slot, reset: false, template: mydiv.innerHTML, })
                break
        }
        hiddenBlockCardProps && hiddenBlockCardProp(uuid)
    })
    styles && logseq.provideStyle({ key: cardType, style: styles })
}

const formatTargetDate = (blockE: BlockEntity, dateFormat: string): Date => {
    let targetDate = new Date()
    try {
        if (blockE?.properties?.targetdate) {
            targetDate = parse(blockE?.properties?.targetdate, dateFormat + " HH:mm:ss", new Date())
        }
        if (blockE?.properties?.completed) {
            targetDate = parse(blockE?.properties?.completed, dateFormat, new Date())
        }
        if (blockE?.properties?.date) {
            targetDate = parse(blockE?.properties?.date, dateFormat, new Date())
        }
        if (blockE?.properties?.time) {
            if (!targetDate) {
                targetDate = new Date()
            }
            const time = parse(blockE?.properties?.time, dateFormat, new Date())
            targetDate.setHours(time.getHours())
            targetDate.setMinutes(time.getMinutes())
            targetDate.setSeconds(time.getSeconds())
        }
    } catch (error) {
    }
    logger.debug('getTargetDate', targetDate)
    return targetDate
}

const formatLink = (input?: string, graph?: string) => {
    // 去除字符串两端的空白字符
    input = input?.trim();
    if (!input) {
        return
    }

    // 检查是否为Markdown格式的http/https链接
    if (/^!\[.*?\]\((http[s]?:\/\/[^)]+)\)$/.test(input)) {
        return input.match(/(http[s]?:\/\/[^)]+)/)?.[0];
    }
    // 检查是否为Markdown格式的本地链接
    else if (/^!\[.*?\]\(\.{1,2}([^)]+\.\w+)/.test(input)) {
        return (graph?.replace(GRAPH_PREFIX, '') || '') + input.match(/\((\.{1,2}[^)]+\.\w+)/)?.[1];
    }
    // 检查是否为http/https链接
    else if (/^http[s]?:\/\/[^ ]+/.test(input)) {
        return input;
    }
    // 检查是否为本地链接
    else if (ASSETS_PATH_REGEX.test(input)) {
        return (graph?.replace(GRAPH_PREFIX, '') || '') + '/assets' + input.match(ASSETS_PATH_REGEX)?.[2];
    } else if (input.includes('.')) {
        return (graph?.replace(GRAPH_PREFIX, '') || '') + '/assets/' + input;
    }
    // 如果不匹配任何已知格式，返回原字符串
    return input;
}

const updateBlockProps = <T extends { [K: string]: any }>(blockE: BlockEntity, data: Partial<T>) => {
    if (!blockE) return; // 如果 blockE 不存在，直接返回

    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'function') return; // 如果 value 是函数，跳过
        if (value !== undefined && value !== null) { // 只有当 value 存在且不是 null 时才更新
            switch (key) {
                case 'color':
                    logseq.Editor.upsertBlockProperty(blockE.uuid, key, value.replace('#', ''));
                    break;
                default:
                    logseq.Editor.upsertBlockProperty(blockE.uuid, key.toLowerCase(), value);
            }
        }
    });
};


export const initTicketFeat = (appConfig?: AppConfig) => {
    logger.debug('initTicketFeat')
    if (!appConfig) {
        appConfig = getGloableUserConfigs()
    }
    const dateFormat = appConfig?.preferredDateFormat || 'yyyy-MM-dd'
    const hiddenBlockCardProps = appConfig?.pluginSettings?.hiddenTicketCardProperties
    const graph = appConfig?.currentGraph
    logger.debug('hiddenBlockCardProperties', hiddenBlockCardProps)

    registeAndRenderMicroDom({
        cardType: 'train-ticket',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <TrainTicket
            fromStation={blockE?.properties?.fromstation}
            toStation={blockE?.properties?.tostation}
            trainNumber={blockE?.properties?.trainnumber}
            date={blockE?.properties?.date}
            departureTime={blockE?.properties?.departuretime}
            arrivalTime={blockE?.properties?.arrivaltime}
            color={blockE?.properties?.color}
            seatInfo={blockE?.properties?.seatinfo}
            editable={blockE?.properties?.editable}
            onUpdate={(data: Partial<TrainTicketProps>) => {
                blockE && updateBlockProps(blockE, data)
            }}
        />,
        defaultPropsFunc: () => { return getdefaultTrainTicketProps(dateFormat) },
        renderType: 'reactive'
    })


    registeAndRenderMicroDom({
        cardType: 'flight-ticket',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <FlightTicket
            fromCity={blockE?.properties?.fromcity}
            toCity={blockE?.properties?.tocity}
            departureAirport={blockE?.properties?.departureairport}
            arrivalAirport={blockE?.properties?.arrivalairport}
            flightNumber={blockE?.properties?.flightnumber}
            airline={blockE?.properties?.airline}
            date={blockE?.properties?.date}
            weekday={blockE?.properties?.weekday || getDay(new Date())}
            departureTime={blockE?.properties?.departuretime}
            arrivalTime={blockE?.properties?.arrivaltime}
            status={blockE?.properties?.status}
            seatInfo={blockE?.properties?.seatinfo}
            mealInfo={blockE?.properties?.mealinfo}
            editable={blockE?.properties?.editable}
            color={blockE?.properties?.color}
            onUpdate={(data: Partial<FlightTicketProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: () => { return getdefaultFilghtTicketProps(dateFormat) },
        renderType: 'reactive'
    })


    registeAndRenderMicroDom({
        cardType: 'flight-ticket2',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <FlightTicket2
            fromCity={blockE?.properties?.fromcity}
            toCity={blockE?.properties?.tocity}
            departureAirport={blockE?.properties?.departureairport}
            arrivalAirport={blockE?.properties?.arrivalairport}
            flightNumber={blockE?.properties?.flightnumber}
            airline={blockE?.properties?.airline}
            date={blockE?.properties?.date}
            weekday={blockE?.properties?.weekday || getDay(new Date())}
            departureTime={blockE?.properties?.departuretime}
            arrivalTime={blockE?.properties?.arrivaltime}
            status={blockE?.properties?.status}
            seatInfo={blockE?.properties?.seatinfo}
            mealInfo={blockE?.properties?.mealinfo}
            editable={blockE?.properties?.editable}
            color={blockE?.properties?.color}
            onUpdate={(data: Partial<FlightTicketProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: () => { return getdefaultFilghtTicketProps(dateFormat) },
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'expense-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <ExpenseCard
            title={blockE?.properties?.title}
            amount={blockE?.properties?.amount || (blockE?.properties?.expense && ('-' + blockE?.properties?.expense)) || (blockE?.properties?.income && ('+' + blockE?.properties?.income))}
            time={blockE?.properties?.time}
            location={blockE?.properties?.location || blockE?.properties?.ip}
            category={blockE?.properties?.category}
            color={blockE?.properties?.color}
            editable={blockE?.properties?.editable}
            onUpdate={(data: Partial<ExpenseCardProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: getdefaultExpenseCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'food-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <FoodCard
            title={blockE?.properties?.title || blockE?.properties?.foodname}
            description={blockE?.properties?.description || blockE?.properties?.specialdishes}
            location={blockE?.properties?.location || blockE?.properties?.ip}
            avgCost={blockE?.properties?.avgCost}
            category={blockE?.properties?.category}
            recommendation={blockE?.properties?.recommendation}
            cover={formatLink(blockE?.properties?.cover, graph)}
            color={blockE?.properties?.color}
            editable={blockE?.properties?.editable}
            onUpdate={(data: Partial<FoodCardProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: getdefaultFoodCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'book-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <BookCard2
            title={blockE?.properties?.title}
            description={blockE?.properties?.description}
            author={blockE?.properties?.author}
            categories={blockE?.properties?.category || blockE?.properties?.categorys}
            tags={blockE?.properties?.tag || blockE?.properties?.tags}
            source={blockE?.properties?.source}
            cover={formatLink(blockE?.properties?.cover, graph)}
            completed={blockE?.properties?.completed}
            time={blockE?.properties?.time}
            readlater={blockE?.properties?.readlater}
            recommendation={blockE?.properties?.recommendation}
            color={blockE?.properties?.color}
            editable={blockE?.properties?.editable}
            onUpdate={(data: Partial<BookCardProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: getdefaultBookCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'rating-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <RatingCard2
            rating={blockE?.properties?.rating}
            review={blockE?.properties?.review}
            color={blockE?.properties?.color}
            source={blockE?.properties?.source}
            completed={blockE?.properties?.completed}
            time={blockE?.properties?.time}
            updateRating={(newRating: number) => { blockE && logseq.Editor.upsertBlockProperty(blockE.uuid, 'rating', newRating) }}
            updateReview={(newReview: string) => { blockE && logseq.Editor.upsertBlockProperty(blockE.uuid, 'review', newReview) }}
            updateSource={(newSource: string) => { blockE && logseq.Editor.upsertBlockProperty(blockE.uuid, 'source', newSource) }}
            updateAll={(data: { rating: number; review: string; source: string; completed: string; time: string }) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: getdefaultRatingCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'flipcountdown-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <FlipCountDown
            targetDate={blockE?.properties?.targetdate}
            color={blockE?.properties?.color}
            message={blockE?.properties?.message} />,
        defaultPropsFunc: getdefaultFlipCountDownProps,
        renderType: 'reactive',
        styles: countDownStyles
    })

    registeAndRenderMicroDom({
        cardType: 'flipcountdown-card2',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <CountdownTimer
            targetDate={formatTargetDate(blockE || mockBlocks[0], dateFormat)}
            color={blockE?.properties?.color}
            message={blockE?.properties?.message}
            animationStyle={blockE?.properties?.animation} />,
        defaultPropsFunc: getdefaultCountdownTimerProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'page-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity, pageInfo?: PageInfo) => {
            const pageE = pageInfo?.pageE
            const newProps = { ...pageE?.properties }
            delete newProps.summary;
            delete newProps.icon
            delete newProps.createdtime
            delete newProps.updatedtime
            return <PageCardPro
                icon={pageE?.properties?.icon}
                title={pageE?.originalName}
                summary={pageE?.properties?.summary}
                properties={newProps}
                createdTime={pageE?.properties?.createdtime || pageE?.createdAt?.toString()}
                updatedTime={pageE?.properties?.updatedtime || pageE?.updatedAt?.toString()}
                onSummaryUpdate={
                    (newSummary: string) => {
                        console.log(newSummary)
                        if (pageE) {
                            logseq.Editor.upsertBlockProperty(pageE.uuid, 'summary', newSummary)
                        }
                    }
                }
                todoList={pageInfo?.todoList}
                onTodoUpdate={(updatedTodo: TodoItem) => {
                    logseq.Editor.updateBlock(updatedTodo.id, updatedTodo.text.replace(updatedTodo.maker, 'DONE'))
                }}
                color={blockE?.properties?.color}
                size={'0'} />
        },
        renderType: 'reactive',
        styles: pageCardStyles,
        pramTemps: ["page:*"]
    })

    registeAndRenderMicroDom({
        cardType: 'page-card2',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity, pageInfo?: PageInfo) => {
            const pageE = pageInfo?.pageE
            const newProps = { ...pageE?.properties }
            delete newProps.summary;
            delete newProps.icon
            delete newProps.createdtime
            delete newProps.updatedtime
            return <PageCard2
                icon={pageE?.properties?.icon}
                title={pageE?.originalName}
                summary={pageE?.properties?.summary}
                properties={newProps}
                createdTime={pageE?.properties?.createdtime || pageE?.createdAt?.toString()}
                updatedTime={pageE?.properties?.updatedtime || pageE?.updatedAt?.toString()}
                onSummaryUpdate={
                    (newSummary: string) => {
                        console.log('update page summary:' + newSummary)
                        if (pageE) {
                            logseq.Editor.upsertBlockProperty(pageE.uuid, 'summary', newSummary)
                        }
                    }
                }
                color={blockE?.properties?.color}
                size={'0'} />
        },
        renderType: 'reactive',
        pramTemps: ["page:*"]
    })


    registeAndRenderMicroDom({
        cardType: 'itinerary-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <Itinerary
            fromCity={blockE?.properties?.fromcity}
            toCity={blockE?.properties?.tocity}
            departureAirport={blockE?.properties?.departureairport}
            arrivalAirport={blockE?.properties?.arrivalairport}
            flightNumber={blockE?.properties?.flightnumber}
            airline={blockE?.properties?.airline}
            date={blockE?.properties?.date}
            departureTime={blockE?.properties?.departuretime}
            arrivalTime={blockE?.properties?.arrivaltime}
            seatInfo={blockE?.properties?.seatinfo}
            mealInfo={blockE?.properties?.mealinfo}
            color={blockE?.properties?.color} />,
        defaultPropsFunc: getdefaultItineraryProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        cardType: 'movie-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <MovieCard
            title={blockE?.properties?.title}
            source={blockE?.properties?.source}
            rating={blockE?.properties?.rating}
            date={blockE?.properties?.date}
            duration={blockE?.properties?.duration}
            categories={blockE?.properties?.categories}
            description={blockE?.properties?.description}
            review={blockE?.properties?.review}
            color={blockE?.properties?.color}
            editable={blockE?.properties?.editable}
            onUpdate={(data: Partial<MovieCardProps>) => { blockE && updateBlockProps(blockE, data) }}
        />,
        defaultPropsFunc: getdefaultMovieCardProps,
        renderType: 'reactive'
    })

}