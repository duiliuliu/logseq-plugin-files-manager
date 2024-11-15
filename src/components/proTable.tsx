
import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Eye, EyeOff } from 'lucide-react'
import { format } from "date-fns"
import { logger } from '@/utils/logger'
import { ColumnDef } from './proTableMeta'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

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
    loadMoreData: () => void
    hasMore: boolean
}

export default function VirtualTable<T extends { [key: string]: any }>({
    data,
    columns: initialColumns,
    rowHeight = 40,
    onSettingsChange,
    loadMoreData,
    hasMore
}: VirtualTableProps<T>) {
    const [columns, setColumns] = useState(initialColumns)
    const [settings, setSettings] = useState<TableSettings>({
        borderColor: "#e5e7eb",
        columns: Object.fromEntries(initialColumns.map(col => [col.key, col.visible ?? true]))
    })
    const [showSettings, setShowSettings] = useState(false)
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
    const containerRef = useRef<HTMLDivElement>(null)
    const [isSettingsVisible, setIsSettingsVisible] = useState(false)
    const [expandedCells, setExpandedCells] = useState<{ [key: string]: boolean }>({})
    const [selectedItem, setSelectedItem] = useState<T | null>(null)
    const [showDialog, setShowDialog] = useState(false)

    const handleScroll = useCallback(() => {
        const container = containerRef.current
        if (!container) return

        const scrollTop = container.scrollTop
        const start = Math.floor(scrollTop / rowHeight)
        const visibleCount = Math.ceil(container.clientHeight / rowHeight)
        const end = Math.min(start + visibleCount + 10, data.length)
        setVisibleRange({ start: Math.max(0, start - 10), end })

        // Check if we're near the bottom and should load more data
        if (container.scrollHeight - scrollTop <= container.clientHeight * 1.5 && hasMore) {
            loadMoreData()
        }
    }, [data.length, rowHeight, hasMore, loadMoreData])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        container.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => container.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    const formatCellValue = useCallback((record: T, column: ColumnDef<T>, rowIndex: number) => {
        try {
            if (column.render) {
                return column.render(record[column.key], record)
            }
            const value = record[column.key]
            if (value === null || value === undefined) return '-'
            if (value instanceof Date || (typeof value === 'number' && value > 1000000000)) {
                return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
            }
            if (typeof value === 'object') {
                return JSON.stringify(value)
            }
            if (typeof value === 'string') {
                return renderStringCell(value, column, rowIndex)
            }
            return value?.toString()
        } catch (error) {
            logger.error(error, record)
            return '-'
        }
    }, [])

    const updateSettings = useCallback((newSettings: Partial<TableSettings>) => {
        const updated = { ...settings, ...newSettings }
        setSettings(updated)
        setColumns(columns => columns.map(col => ({
            ...col,
            visible: updated.columns[col.key]
        })))
        onSettingsChange?.(updated)
    }, [settings, onSettingsChange])

    const toggleColumn = useCallback((key: string) => {
        updateSettings({
            columns: {
                ...settings.columns,
                [key]: !settings.columns[key]
            }
        })
    }, [settings.columns, updateSettings])

    const toggleCellExpansion = useCallback((rowIndex: number, colKey: string) => {
        setExpandedCells(prev => ({
            ...prev,
            [`${rowIndex}-${colKey}`]: !prev[`${rowIndex}-${colKey}`]
        }))
    }, [])

    const renderStringCell = useCallback((value: string, column: ColumnDef<T>, rowIndex: number) => {
        const key = `${rowIndex}-${column.key}`
        const isExpanded = expandedCells[key]

        return (
            <div
                className="cursor-pointer"
                onClick={() => toggleCellExpansion(rowIndex, column.key)}
            >
                {isExpanded ? value : value.slice(0, 15) + "..."}
            </div>
        )
    }, [expandedCells, toggleCellExpansion])

    const handleAction = useCallback((action: string, item: T) => {
        switch (action) {
            case "view":
                setSelectedItem(item)
                setShowDialog(true)
                break
            case "copy":
                navigator.clipboard.writeText(item.path || item.name)
                break
            // Add more actions as needed
        }
    }, [])

    const visibleData = data.slice(visibleRange.start, visibleRange.end)

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
                    className={`h-8 w-8 p-0 opacity-0 transition-opacity ${isSettingsVisible ? "opacity-100" : ""}`}
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
                                        className="p-1 font-medium"
                                        style={{ width: col.width || 150 }}
                                    >
                                        {col.title}
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    <div style={{ transform: `translateY(${visibleRange.start * rowHeight}px)` }}>
                        {visibleData.map((record, idx) => (
                            <ContextMenu key={visibleRange.start + idx}>
                                <ContextMenuTrigger>
                                    <div
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
                                                    {formatCellValue(record, col, visibleRange.start + idx)}
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem onClick={() => handleAction("view", record)}>
                                        View Details
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => handleAction("copy", record)}>
                                        Copy Path
                                    </ContextMenuItem>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem className="text-destructive">
                                        Delete
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedItem?.name}</DialogTitle>
                        <DialogDescription>
                            Details for {selectedItem?.alias || selectedItem?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[80vh]">
                        <div className="space-y-4">
                            {selectedItem && Object.entries(selectedItem).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="font-medium capitalize">{key}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : value?.toString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}