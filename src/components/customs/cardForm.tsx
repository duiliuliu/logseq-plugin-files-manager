import React, { ReactNode, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectOption } from './select'
import { AssetInput } from './assetInput'
import { logger } from '@/utils/logger'

export const commonFieldConfig: { [key: string]: FieldConfig } = {
    title: { label: 'Title', component: 'input' },
    description: { label: 'Description', component: 'textarea' },
    color: { label: 'Color', component: 'input', type: 'color' },
    cover: { label: 'Cover Image', component: 'asset' },
    source: { label: 'Source', component: 'input' },
    category: { label: 'Category', component: 'input' },
    categories: { label: 'Categories', component: 'input' },
    tag: { label: 'Tag', component: 'input' },
    tags: { label: 'Tags', component: 'input' },
    location: { label: 'Location', component: 'input' },
    date: { label: 'Date', component: 'input', type: 'date' },
    time: { label: 'Time', component: 'input', type: 'time' },
    imageposition: {
        label: 'Image Position',
        component: 'select',
        options: [{ value: 'top-image', label: 'Top' },
        { value: 'bottom-image', label: 'Bottom' },
        { value: 'left-image', label: 'Left' },
        { value: 'right-image', label: 'Right' },
        { value: 'overlay', label: 'Overlay' }]
    },
    displaymode: {
        label: 'Display Mode',
        component: 'select',
        options: [{ value: 'normal', label: 'Normal Mode' },
        { value: 'compact', label: 'Compact Mode' }]
    },
    avgcost: { label: 'Average Cost', component: 'input', type: 'number' },
    note: { label: 'Note', component: 'textarea' },
    amount: { label: 'Amount', component: 'input', type: 'number' },
    platform: { label: 'Payment Platform', component: 'input' },
    author: { label: 'Author', component: 'input' },
    completed: { label: 'Date Completed', component: 'input', type: 'date' },
    recommendation: { label: 'Recommendation', component: 'textarea' },
    icon: { label: 'Icon', component: 'input' },
    readlater: { label: 'Read Later', component: 'input' },
}

export interface FieldConfig {
    label: string
    component: 'input' | 'textarea' | 'select' | 'asset'
    type?: string
    options?: SelectOption[]
    icon?: ReactNode
}

export interface CardFormProps {
    data: { [key: string]: any }
    onSave: (data: Partial<{ [key: string]: any }>) => void
    onCancel?: () => void
    fieldConfig?: { [key: string]: FieldConfig }
}

const ConfigurableCardForm: React.FC<CardFormProps> = ({ data, onSave, onCancel, fieldConfig: initfieldConfig }) => {
    const [tempData, setTempData] = useState(data)
    const fieldConfig = { ...commonFieldConfig, ...initfieldConfig }


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setTempData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(tempData)
    }

    const handleCancel = () => {
        setTempData(data)
        onCancel && onCancel()
    }

    const renderField = (key: string, config: FieldConfig) => {
        logger.debug('ConfigurableCardForm-renderField', key, config)
        const commonProps = {
            id: key,
            name: key,
            value: tempData[key],
            onChange: handleInputChange,
            className: "w-full text-xs"
        }

        switch (config.component) {
            case 'textarea':
                return <Textarea {...commonProps} />
            case 'select':
                return <Select {...commonProps}
                    onValueChange={(value: string) => { setTempData(prev => ({ ...prev, [key]: value })) }}
                    options={config.options || []}
                />
            case 'asset':
                return <AssetInput {...commonProps} />
            default:
                return <Input {...commonProps} type={config.type || 'text'} />
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            <CardContent className="p-6">
                <form className="space-y-4 max-h-96 overflow-y-auto" onSubmit={(event) => { event.preventDefault(); }}>
                    {Object.keys(data).map((key) => (
                        fieldConfig[key] && <div key={key} className="flex items-center space-x-2">
                            <Label htmlFor={key} className="w-1/3 text-right whitespace-nowrap">{fieldConfig[key]?.label || key}</Label>
                            <div className="w-2/3">
                                {renderField(key, fieldConfig[key])}
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default ConfigurableCardForm