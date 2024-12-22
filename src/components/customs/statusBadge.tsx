import { Badge } from "@/components/ui/badge"

// 定义枚举类型
export enum Status {
    TODO = 'TODO',
    NOW = 'NOW',
    LATER = 'LATER',
    DONE = 'DONE',
    DOING = 'DOING',
    IN_PROGRESS = 'IN-PROGRESS',
    WAIT = 'WAIT',
    CANCEL = 'CANCEL'
}

export function checkStatusPrefix(inputString: string): Status | null {
    const statusValues = Object.values(Status);
    for (const status of statusValues) {
        if (inputString.startsWith(status)) {
            return status
        }
    }
    return null;
}

const STATUS_STYLES = {
    'TODO': 'bg-slate-500',
    'NOW': 'bg-yellow-500',
    'LATER': 'bg-purple-500',
    'DONE': 'bg-green-500',
    'DOING': 'bg-blue-500',
    'IN-PROGRESS': 'bg-cyan-500',
    'WAIT': 'bg-orange-500',
    'CANCEL': 'bg-red-500'
} as const

const STATUS_CYCLES = {
    'TODO-DOING-DONE': ['TODO', 'DOING', 'DONE'],
    'NOW-LATER-DONE': ['NOW', 'LATER', 'DONE']
} as const

type StatusCycle = keyof typeof STATUS_CYCLES

export function StatusBadge({
    status,
    cycle,
    onUpdate
}: {
    status: Status;
    cycle?: StatusCycle;
    onUpdate?: (newStatus: Status) => void;
}) {
    const handleClick = () => {
        if (cycle && onUpdate) {
            const currentCycle = STATUS_CYCLES[cycle]
            const currentIndex = currentCycle.indexOf(status as any)
            const nextIndex = (currentIndex + 1) % currentCycle.length
            onUpdate(currentCycle[nextIndex] as Status)
        }
    }

    return (
        <Badge
            className={`${STATUS_STYLES[status]} text-white cursor-pointer`}
            onClick={handleClick}
        >
            {status}
        </Badge>
    )
}