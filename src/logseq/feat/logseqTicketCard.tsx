import ReactDOM from "react-dom"
import TrainTicket from "../../components/feat/ticketCard"
import { format } from "date-fns"

export const initTicketFeat = (dateFormat?: string) => {

    logseq.Editor.registerSlashCommand('train-ticket', async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return
        const date = dateFormat ? `[[${format(new Date(), dateFormat)}]]` : format(new Date(), "yyyy-MM-dd")
        logseq.Editor.insertAtEditingCursor(`{{renderer :train-ticket, *}}\nfromstation:: \ntostation:: \ntrainnumber:: \ndate:: ${date}\ndepartureTime:: \ncolor:: blue`)
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
                fromStation={currentBlock.properties?.fromstation || "北京"}
                toStation={currentBlock.properties?.tostation || "上海"}
                trainNumber={currentBlock.properties?.trainnumber || "G101"}
                date={currentBlock.properties?.date || "2024-05-01"}
                departureTime={currentBlock.properties?.departuretime || "14:30"}
                color={currentBlock.properties?.color || "green"}
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

}