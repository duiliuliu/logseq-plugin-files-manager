import { getdefaultBookCardProps } from "@/components/feat/bookCard"
import ExpenseCard, { getdefaultExpenseCardProps } from "@/components/feat/expenseCard"
import FlightTicket, { getdefaultFilghtTicketProps } from "@/components/feat/flightTicket"
import FlightTicket2 from "@/components/feat/flightTicket2"
import FoodCard, { getdefaultFoodCardProps } from "@/components/feat/foodCard"
import { getdefaultRatingCardProps } from "@/components/feat/ratingCard"
import FlipCountDown, { countDownStyles, getdefaultFlipCountDownProps } from "@/components/feat/timeCountdown"
import CountdownTimer, { getdefaultCountdownTimerProps } from "@/components/feat/timeCountDown2"
import TrainTicket, { getdefaultTrainTicketProps } from "@/components/feat/trainTicket"
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
import PageCard, { pageCardStyles } from "@/components/feat/pageCard"
import PageCard2 from "@/components/feat/pageCard2"
import Itinerary, { getdefaultItineraryProps } from "@/components/feat/itinerary"
import RatingCard2 from "@/components/feat/ratingCard2"
import BookCard2, { BookCardProps } from "@/components/feat/bookCard2"

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

type registeAndRenderMicroDomProps = {
    prefix: string,
    hiddenBlockCardProps: boolean | undefined,
    elementFunc: (blockE?: BlockEntity, pageE?: PageEntity) => React.ReactElement,
    defaultPropsFunc?: () => { [K: string]: any }
    renderType?: 'native' | 'reactive'
    pramTemps?: string[]
    styles?: string
}
type renderMicroParam = { [K: string]: any, block?: string, page?: string, display?: string, position?: string, }
const registeAndRenderMicroDom = ({ prefix, hiddenBlockCardProps, elementFunc, defaultPropsFunc, renderType = 'reactive', pramTemps = ['*'], styles }: registeAndRenderMicroDomProps) => {
    logger.debug('registeAndRenderMicroDom', { prefix, hiddenBlockCardProps, renderType })
    let slotContent = ` {{renderer :${prefix}, ${pramTemps.join(',')}}} `
    if (defaultPropsFunc) { slotContent += '\n' + propertiesToStr(defaultPropsFunc())[0] }
    logseq.Editor.registerSlashCommand(prefix, async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        logseq.Editor.updateBlock(block.uuid, block.content + slotContent)
    })

    logseq.App.onMacroRendererSlotted(async ({ slot, payload: { arguments: args, uuid } }) => {
        const id = prefix + '-' + uuid
        if (args?.[0].trim() != (':' + prefix)) { return }
        let blockE: BlockEntity | null
        let pageE: PageEntity | null
        let wrapElementFunc = elementFunc

        const params: renderMicroParam = args.reduce((acc, curr) => {
            const [key, value] = curr.trim().split(':');
            if (key && value) {
                //@ts-ignore
                acc[key] = value?.trim();
            }
            return acc;
        }, {});
        logger.debug('onMacroRendererSlotted-params', params)
        if (params.block) { blockE = (await logseq.Editor.getBlock(params.block.replace('((', '').replace('))', ''))) } else { blockE = (await logseq.Editor.getBlock(uuid)) }
        if (params.page) { pageE = await logseq.Editor.getPage(params.page.replace('[[', '').replace(']]', '')) } else { pageE = (await logseq.Editor.getCurrentPage()) as PageEntity }
        if (params.display) {
            wrapElementFunc = (blockE?: BlockEntity, pageE?: PageEntity) => <FlexibleLayout
                text={blockE?.content.replace(slotContent, '').replace(/\w+:: .*/g, '') || ''}
                media={elementFunc(blockE, pageE)}
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
                mydiv && ReactDOM.render(wrapElementFunc(blockE || undefined, pageE || undefined), mydiv);
                // showCardUI()
                break
            case 'native':
                logger.debug('registeAndRenderMicroDom-onMacroRendererSlotted-reactive')
                mydiv = document.createElement('div');
                mydiv && ReactDOM.render(wrapElementFunc(blockE || undefined, pageE || undefined), mydiv);
                logseq.provideUI({ key: id, slot, reset: false, template: mydiv.innerHTML, })
                break
        }
        hiddenBlockCardProps && hiddenBlockCardProp(uuid)
    })
    styles && logseq.provideStyle({ key: prefix, style: styles })
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
        return graph?.replace(GRAPH_PREFIX, '') || '' + input.match(/\((\.{1,2}[^)]+\.\w+)/)?.[1];
    }
    // 检查是否为http/https链接
    else if (/^http[s]?:\/\/[^ ]+/.test(input)) {
        return input;
    }
    // 检查是否为本地链接
    else if (ASSETS_PATH_REGEX.test(input)) {
        return graph?.replace(GRAPH_PREFIX, '') || '' + 'assets' + input.match(ASSETS_PATH_REGEX)?.[2];
    }
    // 如果不匹配任何已知格式，返回原字符串
    return input;
}


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
        prefix: 'train-ticket',
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
        />,
        defaultPropsFunc: () => { return getdefaultTrainTicketProps(dateFormat) },
        renderType: 'reactive'
    })


    registeAndRenderMicroDom({
        prefix: 'flight-ticket',
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
            color={blockE?.properties?.color}
        />,
        defaultPropsFunc: () => { return getdefaultFilghtTicketProps(dateFormat) },
        renderType: 'reactive'
    })


    registeAndRenderMicroDom({
        prefix: 'flight-ticket2',
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
            color={blockE?.properties?.color}
        />,
        defaultPropsFunc: () => { return getdefaultFilghtTicketProps(dateFormat) },
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        prefix: 'expense-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <ExpenseCard
            title={blockE?.properties?.title}
            amount={blockE?.properties?.amount || (blockE?.properties?.expense && ('-' + blockE?.properties?.expense)) || (blockE?.properties?.income && ('+' + blockE?.properties?.income))}
            time={blockE?.properties?.time}
            location={blockE?.properties?.location || blockE?.properties?.ip}
            category={blockE?.properties?.category}
            color={blockE?.properties?.color}
        />,
        defaultPropsFunc: getdefaultExpenseCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        prefix: 'food-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity) => <FoodCard
            foodName={blockE?.properties?.foodname}
            specialDishes={blockE?.properties?.specialdishes}
            location={blockE?.properties?.location || blockE?.properties?.ip}
            avgCost={blockE?.properties?.avgCost}
            category={blockE?.properties?.category}
            recommendation={blockE?.properties?.recommendation}
            cover={formatLink(blockE?.properties?.cover, graph)}
            color={blockE?.properties?.color}
        />,
        defaultPropsFunc: getdefaultFoodCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        prefix: 'book-card',
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
            onUpdate={(data: Partial<BookCardProps>) => {
                Object.entries(data).forEach(([k, v]) => {
                    if (typeof v === 'function') {
                        return
                    }
                    if (v) {
                        blockE && logseq.Editor.upsertBlockProperty(blockE.uuid, k, v)
                    }
                })
            }}
        />,
        defaultPropsFunc: getdefaultBookCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        prefix: 'rating-card',
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
            updateAll={(data: { rating: number; review: string; source: string; completed: string; time: string }) => {
                Object.entries(data).forEach(([k, v]) => {
                    if (typeof v === 'function') {
                        return
                    }
                    if (v) {
                        blockE && logseq.Editor.upsertBlockProperty(blockE.uuid, k, v)
                    }
                })
            }}
        />,
        defaultPropsFunc: getdefaultRatingCardProps,
        renderType: 'reactive'
    })

    registeAndRenderMicroDom({
        prefix: 'flipcountdown-card',
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
        prefix: 'flipcountdown-card2',
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
        prefix: 'page-card',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity, pageE?: PageEntity) => {
            const newProps = { ...pageE?.properties }
            delete newProps.summary;
            delete newProps.icon
            delete newProps.createdtime
            delete newProps.updatedtime
            return <PageCard
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
                color={blockE?.properties?.color}
                size={'0'} />
        },
        renderType: 'reactive',
        styles: pageCardStyles
    })

    registeAndRenderMicroDom({
        prefix: 'page-card2',
        hiddenBlockCardProps,
        elementFunc: (blockE?: BlockEntity, pageE?: PageEntity) => {
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
        renderType: 'reactive'
    })


    registeAndRenderMicroDom({
        prefix: 'itinerary-card',
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

}