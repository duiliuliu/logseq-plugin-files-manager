import React, { useState, forwardRef } from 'react'
import { Card } from "@/components/ui/card"
import { getColor, getColorBg } from './color'
import { logger } from '@/utils/logger'
import ConfigurableCardForm, { FieldConfig, commonFieldConfig } from './cardForm'
import { SettingsMenu } from './settingMenus'

interface CardWithEditProps {
    data: { [key: string]: any }
    renderContent: (data: { [key: string]: any }, toggleDisplayMode?: (mode: string) => void) => React.ReactNode
    onUpdate?: (data: Partial<{ [key: string]: any }>) => void
    onEditBlock?: () => void
    onAddBlock?: () => void
    fieldConfig?: { [key: string]: FieldConfig }
}

const CardWithEdit = forwardRef<HTMLDivElement, CardWithEditProps>(({
    data,
    renderContent,
    onUpdate,
    onEditBlock,
    onAddBlock,
    fieldConfig
}, ref) => {
    logger.debug('init CardWithEdit', data)
    const [isEditing, setIsEditing] = useState(false)
    const [tempData, setTempData] = useState(data)

    const handleUpdate = (newData: Partial<{ [key: string]: any }>) => {
        setTempData(prev => ({ ...prev, ...newData }))
        setIsEditing(false)
        if (onUpdate) {
            onUpdate(newData)
        }
    }

    const handleDoubleClick = () => {
        if (data.editable) {
            setIsEditing(true)
        }
    }

    if (isEditing) {
        return (
            <ConfigurableCardForm
                data={tempData}
                onSave={handleUpdate}
                onCancel={() => setIsEditing(false)}
                fieldConfig={{ ...commonFieldConfig, ...fieldConfig }}
            />
        )
    }

    return (
        <Card
            ref={ref}
            className={`relative overflow-visible ${getColorBg(tempData.color)}`}
            style={{ minWidth: 380, backgroundColor: getColor(tempData.color) }}
            onDoubleClick={handleDoubleClick}
        >
            {data.editable && (
                <SettingsMenu
                    onEdit={() => setIsEditing(true)}
                    onEditBlock={onEditBlock}
                    onAddBlock={onAddBlock}
                    displayMode={tempData.displaymode}
                    onDisplayModeChange={(mode) => setTempData(prev => ({ ...prev, displaymode: mode }))}
                />
            )}
            <div className='w-full max-w-sm mx-auto'>
                {renderContent(tempData, (mode) => setTempData(prev => ({ ...prev, displaymode: mode })))}
            </div>
        </Card>
    )
})

CardWithEdit.displayName = 'CardWithEdit'

export default CardWithEdit