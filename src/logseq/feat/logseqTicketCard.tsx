import ReactDOM from "react-dom"
import TrainTicket from "../../components/feat/ticketCard"

export const initTicketFeat = () => {
    logseq.Editor.registerSlashCommand('train-ticket', async () => {
        const block = await logseq.Editor.getCurrentBlock()
        if (!block?.uuid) return

        logseq.Editor.insertAtEditingCursor(`{{renderer :train-ticket, *}}`)
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
            key: 'ticket-card',
            slot,
            reset: false,
            template: myDiv.innerHTML,
        })

    })

}