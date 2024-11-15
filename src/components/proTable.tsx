
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Eye, EyeOff } from "lucide-react"
import { format } from "date-fns"
import { logger } from '@/utils/logger'

interface ColumnDef<T> {
    key: string
    title: string
    visible?: boolean
    width?: number
    render?: (value: any, record: T) => React.ReactNode
}

export interface TableSettings {
    borderColor: string
    columns: { [key: string]: boolean }
}

interface VirtualTableProps<T> {
    data: T[]
    columns: ColumnDef<T>[]
    rowHeight?: number
    onSettingsChange?: (settings: TableSettings) => void
    className?: string
}

export default function VirtualTable<T extends { [key: string]: any }>({
    data,
    columns: initialColumns,
    rowHeight = 40,
    onSettingsChange }: VirtualTableProps<T>) {
    logger.debug('init VIrtualTable', data, initialColumns)

    const [columns, setColumns] = useState(initialColumns)
    const [settings, setSettings] = useState<TableSettings>({
        borderColor: "#e5e7eb",
        columns: Object.fromEntries(initialColumns.map(col => [col.key, col.visible ?? true]))
    })
    const [showSettings, setShowSettings] = useState(false)
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
    const containerRef = useRef<HTMLDivElement>(null)
    const [isSettingsVisible, setIsSettingsVisible] = useState(false)

    // Handle scroll to update visible range
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleScroll = () => {
            const scrollTop = container.scrollTop
            const start = Math.floor(scrollTop / rowHeight)
            const visibleCount = Math.ceil(container.clientHeight / rowHeight)
            const end = Math.min(start + visibleCount + 10, data.length) // Add buffer
            setVisibleRange({ start: Math.max(0, start - 10), end }) // Add buffer
        }

        container.addEventListener('scroll', handleScroll)
        handleScroll() // Initial calculation

        return () => container.removeEventListener('scroll', handleScroll)
    }, [data.length, rowHeight])

    // Format cell value based on type
    const formatCellValue = (value: any) => {
        if (value === null || value === undefined) return '-'
        if (value instanceof Date || (typeof value === 'number' && value > 1000000000)) {
            return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
        }
        if (typeof value === 'object') {
            return JSON.stringify(value)
        }
        return value.toString()
    }

    const updateSettings = (newSettings: Partial<TableSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        setColumns(columns.map(col => {
            col.visible = newSettings?.columns?.[col.key]
            return col
        }))
        onSettingsChange?.(updated)
    }

    const toggleColumn = (key: string) => {
        const newColumns = {
            ...settings.columns,
            [key]: !settings.columns[key]
        }
        updateSettings({ columns: newColumns })
    }

    const visibleData = data.slice(visibleRange.start, visibleRange.end)
    const paddingTop = visibleRange.start * rowHeight
    const paddingBottom = (data.length - visibleRange.end) * rowHeight

    return (
        <div className="relative w-full">
            <div
                className="absolute right-2 top-2 z-20"
                onMouseEnter={() => setIsSettingsVisible(true)}
                onMouseLeave={() => setIsSettingsVisible(false)}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className={`h-8 w-8 p-0 opacity-0 transition-opacity ${isSettingsVisible ? "opacity-100" : ""
                        }`}
                >
                    <Settings className="h-4 w-4" />
                </Button>
                {showSettings && (
                    <Card className="absolute right-0 top-full mt-2 w-[300px]">
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Border Color</label>
                                <Input
                                    type="color"
                                    value={settings.borderColor}
                                    onChange={(e) => updateSettings({ borderColor: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visible Columns</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {columns.map((col) => (
                                        <Button
                                            key={col.key}
                                            variant="outline"
                                            className="justify-start"
                                            onClick={() => toggleColumn(col.key)}
                                        >
                                            {settings.columns[col.key] ? (
                                                <Eye className="mr-2 h-4 w-4" />
                                            ) : (
                                                <EyeOff className="mr-2 h-4 w-4" />
                                            )}
                                            {col.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div
                ref={containerRef}
                className="w-full overflow-auto border rounded-md"
                style={{
                    height: `calc(100vh - 200px)`,
                    borderColor: settings.borderColor
                }}
            >
                <div style={{ height: `${data.length * rowHeight}px`, position: 'relative' }}>
                    <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <div
                            className="flex bg-muted"
                            style={{ borderBottom: `1px solid ${settings.borderColor}` }}
                        >
                            {columns.map((col) =>
                                settings.columns[col.key] ? (
                                    <div
                                        key={col.key}
                                        className="p-2 font-medium"
                                        style={{ width: col.width || 150 }}
                                    >
                                        {col.title}
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    <div style={{ paddingTop, paddingBottom }}>
                        {visibleData.map((record, idx) => (
                            <div
                                key={idx}
                                className="flex hover:bg-muted/50"
                                style={{
                                    borderBottom: `1px solid ${settings.borderColor}`,
                                    height: rowHeight
                                }}
                            >
                                {columns.map((col) =>
                                    settings.columns[col.key] ? (
                                        <div
                                            key={col.key}
                                            className="p-2 truncate"
                                            style={{ width: col.width || 150 }}
                                        >
                                            {col.render
                                                ? col.render(record[col.key], record)
                                                : formatCellValue(record[col.key])}
                                        </div>
                                    ) : null
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}