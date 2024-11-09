import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Edit, FileEdit, FilePlus, LayoutGrid } from "lucide-react"
import { Select } from './select'
import { logger } from '@/utils/logger'

interface SettingsMenuProps {
    onEdit: () => void
    onEditBlock?: () => void
    onAddBlock?: () => void
    displayMode: string
    onDisplayModeChange: (mode: string) => void
}

export function SettingsMenu({
    onEdit,
    onEditBlock,
    onAddBlock,
    displayMode,
    onDisplayModeChange }: SettingsMenuProps) {
    const [showSettings, setShowSettings] = useState<boolean>(false)
    const settingsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            logger.debug('SettingsMenu handleClickOutside', event.target, settingsRef.current, settingsRef.current?.contains(event.target as Node))
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)

        return () => { document.removeEventListener('mousedown', handleClickOutside); }
    }, [])

    return (
        <div className="absolute top-2 right-2" style={{ zIndex: 3 }} ref={settingsRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
            >
                <Settings className="h-4 w-4" />
            </Button>
            {showSettings && (
                <Card className="absolute right-0 mt-1 w-48">
                    <CardContent className="p-2">
                        <ul className="space-y-1 text-sm list-none">
                            <li>
                                <Button variant="ghost" className="w-full justify-start" onClick={onEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </li>
                            {onEditBlock && (
                                <li>
                                    <Button variant="ghost" className="w-full justify-start" onClick={onEditBlock}>
                                        <FileEdit className="mr-2 h-4 w-4" />
                                        Edit Block
                                    </Button>
                                </li>
                            )}
                            {onAddBlock && (
                                <li>
                                    <Button variant="ghost" className="w-full justify-start" onClick={onAddBlock}>
                                        <FilePlus className="mr-2 h-4 w-4" />
                                        Add Block
                                    </Button>
                                </li>
                            )}
                            <li>
                                <Select
                                    value={displayMode}
                                    onValueChange={(mode: string) => { onDisplayModeChange(mode); setShowSettings(false) }}
                                    options={[
                                        { value: 'normal', label: 'Normal Mode' },
                                        { value: 'compact', label: 'Compact Mode' }
                                    ]}
                                    icon={<LayoutGrid className="mr-2 h-4 w-4" />}
                                />
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}