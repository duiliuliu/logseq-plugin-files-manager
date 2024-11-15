
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type DisplayStyle = 'grid-row' | 'grid-row-border' | 'grid-col' | 'grid-col-border' | 'overlay' | 'inline'

export interface FlexibleLayoutProps {
    mainElement: React.ReactNode
    children: React.ReactNode[]
    display?: DisplayStyle
    onDisplayUpdate?: (newDisplay: DisplayStyle) => void
    onTextUpdate?: (index: number, text: string | null) => void
    className?: string
}

export default function FlexibleLayout({
    mainElement,
    children,
    display = 'grid-row',
    onDisplayUpdate,
    onTextUpdate,
    className
}: FlexibleLayoutProps) {
    const [showSettings, setShowSettings] = useState(false)
    const [isSettingsVisible, setIsSettingsVisible] = useState(false)
    const [currentDisplay, setCurrentDisplay] = useState(display)
    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editText, setEditText] = useState('')

    const settingsRef = useRef<HTMLDivElement>(null)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsSelectOpen(false)
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false)
            }
        }

        parent?.document?.addEventListener('mousedown', handleClickOutside)
        return () => parent?.document?.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleTextDoubleClick = (index: number, text: string) => {
        if (onTextUpdate) {
            setEditingIndex(index)
            setEditText(text)
        }
    }

    const handleTextUpdate = () => {
        if (editingIndex !== null && onTextUpdate) {
            onTextUpdate(editingIndex, editText)
            setEditingIndex(null)
        }
    }

    const handleTextDelete = () => {
        if (editingIndex !== null && onTextUpdate) {
            onTextUpdate(editingIndex, null)
            setEditingIndex(null)
        }
    }

    const getGridStyles = () => {
        switch (currentDisplay) {
            case 'grid-row':
                return 'grid grid-cols-1 md:grid-cols-2 gap-4'
            case 'grid-row-border':
                return 'grid grid-cols-1 md:grid-cols-2 gap-4 [&>*]:border [&>*]:border-gray-200 [&>*]:p-4 [&>*]:rounded-md'
            case 'grid-col':
                return 'grid grid-cols-1 gap-4'
            case 'grid-col-border':
                return 'grid grid-cols-1 gap-4 [&>*]:border [&>*]:border-gray-200 [&>*]:p-4 [&>*]:rounded-md'
            case 'overlay':
                return 'relative'
            case 'inline':
                return 'flex flex-wrap items-center gap-4'
            default:
                return ''
        }
    }

    const renderContent = () => {
        const allElements = [mainElement, ...children]

        if (currentDisplay === 'overlay') {
            return (
                <div className="relative">
                    <div className="relative z-10 max-w-[60%]">{mainElement}</div>
                    <div className="absolute top-4 left-[40%] z-0 max-w-[60%]">{children[0]}</div>
                </div>
            )
        }

        return allElements.map((child, index) => {
            if (typeof child === 'string' && onTextUpdate) {
                return editingIndex === index ? (
                    <div key={index} className="flex gap-2">
                        <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-grow"
                        />
                        <Button size="sm" onClick={handleTextUpdate}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>Cancel</Button>
                        <Button size="sm" variant="destructive" onClick={handleTextDelete}>Delete</Button>
                    </div>
                ) : (
                    <div
                        key={index}
                        className="p-4 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onDoubleClick={() => handleTextDoubleClick(index, child)}
                    >
                        {child}
                    </div>
                )
            }
            return <div key={index} className={index === 0 && currentDisplay.startsWith('grid-row') ? 'md:col-span-2' : ''}>{child}</div>
        })
    }

    const handleDisplayChange = (newDisplay: DisplayStyle) => {
        setCurrentDisplay(newDisplay)
        if (onDisplayUpdate) {
            onDisplayUpdate(newDisplay)
        }
    }

    return (
        <div className={cn("w-full max-w-4xl mx-auto relative", className)}>
            <div
                className="absolute right-2 top-2 z-20"
                onMouseEnter={() => setIsSettingsVisible(true)}
                onMouseLeave={() => setIsSettingsVisible(false)}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn(
                        "h-8 w-8 p-0 opacity-0 transition-opacity",
                        isSettingsVisible && "opacity-100"
                    )}
                >
                    <Settings className="h-4 w-4" />
                </Button>
                {showSettings && (
                    <Card className="absolute right-0 top-full mt-2 w-[200px]">
                        <CardContent className="p-2">
                            <div ref={selectRef} className="relative">
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isSelectOpen}
                                    className="w-full justify-between"
                                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                                >
                                    {currentDisplay}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                                {isSelectOpen && (
                                    <Card className="absolute top-full left-0 w-full mt-1 z-50">
                                        <CardContent className="p-0">
                                            {[
                                                'grid-row',
                                                'grid-row-border',
                                                'grid-col',
                                                'grid-col-border',
                                                'overlay',
                                                'inline'
                                            ].map((option) => (
                                                <Button
                                                    key={option}
                                                    variant="ghost"
                                                    className="w-full justify-start font-normal"
                                                    onClick={() => {
                                                        handleDisplayChange(option as DisplayStyle)
                                                        setIsSelectOpen(false)
                                                    }}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className={getGridStyles()}>
                {renderContent()}
            </div>
        </div>
    )
}