import ReactDOM from "react-dom"
import TrainTicket, { TrainTicketProps } from "../../components/feat/trainTicket"
import { format, getDay } from "date-fns"
import FlightTicket, { FlightTicketProps } from "../../components/feat/flightTicket"
import FlightTicket2 from "@/components/feat/flightTicket2"
import { propertiesToStr } from "./logseqDefaultPageProps"


const getdefaultTrainTicketProps = (dateFormat?: string) => {
    const defaultProps: TrainTicketProps = {
        fromStation: '北京',
        toStation: '上海',
        trainNumber: 'G717',
        date: dateFormat ? `[[${format(new Date(), dateFormat)}]]` : format(new Date(), "yyyy-MM-dd"),
        departureTime: '10:00',
        arrivalTime: "20:00",
        color: 'green',
        seatInfo: '一等座',
    }
    return defaultProps
}

const getdefaultFilghtTicketProps = (dateFormat?: string) => {
    const defaultProps: FlightTicketProps = {
        date: dateFormat ? `[[${format(new Date(), dateFormat)}]]` : format(new Date(), "yyyy-MM-dd"),
        weekday: '星期五',
        fromCity: '上海',
        toCity: '深圳',
        departureTime: '11:00',
        arrivalTime: '13:00',
        departureAirport: '浦东机场T1',
        arrivalAirport: '宝山机场T2',
        flightNumber: 'CZ3587',
        airline: '中国南方航空',
        status: '准时',
        seatInfo: '经济舱 14A',
        mealInfo: '有餐食',
        color: 'dark'
    }
    return defaultProps
}

export const initTicketFeat = (dateFormat?: string) => {

    logseq.Editor.registerSlashCommand('train-ticket', async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        // logseq.Editor.insertAtEditingCursor(`{{renderer :train-ticket, *}}\nfromstation:: \ntostation:: \ntrainnumber:: \ndate:: ${date}\ndepartureTime:: \ncolor:: blue`)
        logseq.Editor.updateBlock(block.uuid, block.content + " {{renderer :train-ticket, *}} \n" + propertiesToStr(getdefaultTrainTicketProps(dateFormat))[0])
    })

    logseq.Editor.registerSlashCommand('flight-ticket', async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        // logseq.Editor.insertAtEditingCursor(`{{renderer :flight-ticket, *}}\nfromCity:: \ntoCity:: \ndepartureAirport:: \narrivalAirport:: \nflightNumber:: \ndate:: ${date}\ndepartureTime:: \ncolor:: blue`)

        logseq.Editor.updateBlock(block.uuid, block.content + " {{renderer :flight-ticket, *}} \n" + propertiesToStr(getdefaultFilghtTicketProps(dateFormat))[0])
    })


    logseq.Editor.registerSlashCommand('flight-ticket2', async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        // logseq.Editor.insertAtEditingCursor(`{{renderer :flight-ticket, *}}\nfromCity:: \ntoCity:: \ndepartureAirport:: \narrivalAirport:: \nflightNumber:: \ndate:: ${date}\ndepartureTime:: \ncolor:: blue`)

        logseq.Editor.updateBlock(block.uuid, block.content + " {{renderer :flight-ticket2, *}} \n" + propertiesToStr(getdefaultFilghtTicketProps(dateFormat))[0])
    })


    logseq.App.onMacroRendererSlotted(async ({ slot, payload: { arguments: args, uuid } }) => {
        // logseq.provideStyle(`#${slot}, #${PREFIX}-${slot}-${PLUGIN_ID} {display: flex;} #${PREFIX}-${slot}-${PLUGIN_ID} {flex: 1;}`)

        if (args?.[0].trim() != ':train-ticket') {
            return
        }
        let currentBlock
        let arg1 = args[1]?.trim()
        if (arg1 === '*') {
            currentBlock = (await logseq.Editor.getBlock(uuid))
        } else {
            return
        }

        if (!currentBlock) {
            return
        }

        let myDiv = document.createElement('div');
        ReactDOM.render(
            <TrainTicket
                fromStation={currentBlock.properties?.fromstation}
                toStation={currentBlock.properties?.tostation}
                trainNumber={currentBlock.properties?.trainnumber}
                date={currentBlock.properties?.date}
                departureTime={currentBlock.properties?.departuretime}
                arrivalTime={currentBlock.properties?.arrivaltime}
                color={currentBlock.properties?.color}
                seatInfo={currentBlock.properties?.seatinfo}
            />,
            myDiv
        );

        logseq.provideUI({
            key: 'train-ticket-' + uuid,
            slot,
            reset: false,
            template: myDiv.innerHTML,
        })

    })

    logseq.App.onMacroRendererSlotted(async ({ slot, payload: { arguments: args, uuid } }) => {
        // logseq.provideStyle(`#${slot}, #${PREFIX}-${slot}-${PLUGIN_ID} {display: flex;} #${PREFIX}-${slot}-${PLUGIN_ID} {flex: 1;}`)

        if (args?.[0].trim() != ':flight-ticket') {
            return
        }
        let currentBlock
        let arg1 = args[1]?.trim()
        if (arg1 === '*') {
            currentBlock = (await logseq.Editor.getBlock(uuid))
        } else {
            return
        }

        if (!currentBlock) {
            return
        }

        let myDiv = document.createElement('div');
        ReactDOM.render(
            <FlightTicket
                fromCity={currentBlock.properties?.fromcity}
                toCity={currentBlock.properties?.tocity}
                departureAirport={currentBlock.properties?.departureairport}
                arrivalAirport={currentBlock.properties?.arrivalairport}
                flightNumber={currentBlock.properties?.flightnumber}
                airline={currentBlock.properties?.airline}
                date={currentBlock.properties?.date}
                weekday={currentBlock.properties?.weekday || getDay(new Date())}
                departureTime={currentBlock.properties?.departuretime}
                arrivalTime={currentBlock.properties?.arrivaltime}
                status={currentBlock.properties?.status}
                seatInfo={currentBlock.properties?.seatinfo}
                mealInfo={currentBlock.properties?.mealinfo}
                color={currentBlock.properties?.color}
            />,
            myDiv
        );
        logseq.provideUI({
            key: 'flight-ticket-' + uuid,
            slot,
            reset: false,
            template: myDiv.innerHTML,
        })
    })

    logseq.App.onMacroRendererSlotted(async ({ slot, payload: { arguments: args, uuid } }) => {
        // logseq.provideStyle(`#${slot}, #${PREFIX}-${slot}-${PLUGIN_ID} {display: flex;} #${PREFIX}-${slot}-${PLUGIN_ID} {flex: 1;}`)

        if (args?.[0].trim() != ':flight-ticket2') {
            return
        }
        let currentBlock
        let arg1 = args[1]?.trim()
        if (arg1 === '*') {
            currentBlock = (await logseq.Editor.getBlock(uuid))
        } else {
            return
        }

        if (!currentBlock) {
            return
        }

        let myDiv = document.createElement('div');
        ReactDOM.render(
            <FlightTicket2
                fromCity={currentBlock.properties?.fromcity}
                toCity={currentBlock.properties?.tocity}
                departureAirport={currentBlock.properties?.departureairport}
                arrivalAirport={currentBlock.properties?.arrivalairport}
                flightNumber={currentBlock.properties?.flightnumber}
                airline={currentBlock.properties?.airline}
                date={currentBlock.properties?.date}
                weekday={currentBlock.properties?.weekday || getDay(new Date())}
                departureTime={currentBlock.properties?.departuretime}
                arrivalTime={currentBlock.properties?.arrivaltime}
                status={currentBlock.properties?.status}
                seatInfo={currentBlock.properties?.seatinfo}
                mealInfo={currentBlock.properties?.mealinfo}
                color={currentBlock.properties?.color}
            />,
            myDiv
        );
        logseq.provideUI({
            key: 'flight-ticket2-' + uuid,
            slot,
            reset: false,
            template: myDiv.innerHTML,
        })
    })

}