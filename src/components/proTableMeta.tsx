import { DataItem } from "@/data/types"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { logger } from "@/utils/logger"

export interface ColumnDef<T> {
    key: string
    title: string
    visible?: boolean
    width?: number
    render?: (value: any, record: T) => React.ReactNode
}

export const tableColumns = [
    {
        key: "name",
        title: "Name",
        width: 200,
        render: (_: string, record: DataItem) => (
            <div className="flex items-center gap-2">
                {record.icon && <span dangerouslySetInnerHTML={{ __html: record.icon }} />}
                <span>{record.alias || record.name}</span>
            </div>
        )
    },
    {
        key: "dataType",
        title: "Type",
        width: 100,
        render: (value: string) => (
            <Badge variant="secondary">{value}</Badge>
        )
    },
    {
        key: "createdTime",
        title: "Created",
        width: 150,
        visible: false,
        render: (value: number) => {
            if (value) {
                try {
                    return format(Number(value), "yyyy-MM-dd HH:mm")
                } catch (error) {
                    logger.error(error, value)
                }
            }
            return '-'
        }
    },
    {
        key: "updatedTime",
        title: "Updated",
        width: 150,
        render: (value: number) => value ? format(Number(value), "yyyy-MM-dd HH:mm") : "-"
    },
    {
        key: "size",
        title: "Size",
        width: 100
    },
    {
        key: "related",
        title: "Tags",
        width: 200,
        render: (related: DataItem['related']) => (
            <div className="flex gap-1">
                {related?.filter(r => r.relatedType === 'tag').map((r, i) => (
                    <Badge key={i} variant="outline">{r.relatedTag}</Badge>
                ))}
            </div>
        )
    },
    {
        key: "path",
        title: "Path",
        width: 380
    }
]
