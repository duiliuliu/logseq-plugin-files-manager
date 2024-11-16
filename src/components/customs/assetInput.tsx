import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input, InputProps } from '../ui/input'
import { Plus, X } from 'lucide-react'

interface Asset {
    type: 'url' | 'file' | 'BLANK'
    value: string
}

interface AssetInputProps extends InputProps {
    value?: string
}

export const BLANK_IMAGE = 'BLANK'

export function AssetInput({ id, name, value, onChange, className }: AssetInputProps) {
    const [assets, setAssets] = useState<Asset[]>(value ? value.split(',').map(v => ({ type: 'url', value: v.trim() })) : [])
    const [inputType, setTnputType] = useState<'url' | 'file' | 'BLANK'>('url'); // 默认为url模式
    const [inputLabel, setTnputLabel] = useState<'Use URL' | 'Use File' | 'Use BLANK'>('Use URL'); // 默认为url模式

    const [currentUrl, setCurrentUrl] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const addAsset = (newAsset: Asset) => {
        const updatedAssets = [...assets, newAsset]
        setAssets(updatedAssets)
        if (onChange) {
            //@ts-ignore
            onChange({ target: { name: name || 'input', value: updatedAssets.map(a => a.value).join(',') } });
        }
    }

    const removeAsset = (index: number) => {
        const updatedAssets = assets.filter((_, i) => i !== index)
        setAssets(updatedAssets)
        if (onChange) {
            // @ts-ignore
            onChange({ target: { name: name || 'input', value: updatedAssets.map(a => a.value).join(',') } });
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUrl(event.target.value)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && currentUrl.trim() !== '') {
            event.preventDefault()
            addAsset({ type: 'url', value: currentUrl.trim() })
            setCurrentUrl('')
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            addAsset({ type: 'file', value: file.name })
        }
    }

    const addBlankImage = () => {
        addAsset({ type: 'BLANK', value: BLANK_IMAGE })
    }

    const toggleInputType = () => {
        setTnputType((prevInputType) => {
            switch (prevInputType) {
                case 'url':
                    setTnputLabel('Use File')
                    return 'file';
                case 'file':
                    setTnputLabel('Use BLANK')
                    return 'BLANK';
                case 'BLANK':
                    setTnputLabel('Use URL')
                    return 'url';
                default:
                    setTnputLabel('Use URL')
                    return 'url';
            }
        });
    };

    const renderInput = () => {
        switch (inputType) {
            case 'url':
                return <Input
                    id={id + 'url'}
                    name={name}
                    type="text"
                    placeholder="Enter URL and press Enter"
                    value={currentUrl}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={className}
                />;
            case 'file':
                return <Input
                    id={id + 'file'}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className={className}
                />;
            case 'BLANK':
                return <Button type="button" onClick={addBlankImage}>
                    <Plus className="mr-2 h-4 w-4" /> Blank
                </Button>
            default:
                return <Input
                    id={id + 'url'}
                    name={name}
                    type="text"
                    placeholder="Enter URL and press Enter"
                    value={currentUrl}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className={className}
                />;
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {assets.map((asset, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-md p-2">
                        <span className="text-sm mr-2">{asset.type === 'url' ? '🔗' : '📁'} {asset.value}</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAsset(index)}
                            className="h-5 w-5 rounded-full"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex items-center space-x-2">
                {renderInput()}
                <Button type="button" onClick={toggleInputType}>
                    {inputLabel}
                </Button>
            </div>
        </div>
    )
}