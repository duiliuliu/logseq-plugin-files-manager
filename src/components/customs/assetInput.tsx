import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input, InputProps } from '../ui/input'


export function AssetInput(props: InputProps) {
    const [isUrlInput, setIsUrlInput] = useState(true)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toggleCoverInputType = () => {
        setIsUrlInput(!isUrlInput)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (props.onChange) {
                // @ts-ignore
                props.onChange({ target: { name: props.name || 'input', value: file.name } })
            }

        }
    }

    return (<div className="flex items-center space-x-2 flex-grow">
        {isUrlInput ? (
            <Input
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                className={props.className}
            />
        ) : (
            <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className={props.className}
            />
        )}
        <Button type="button" onClick={toggleCoverInputType}>
            {isUrlInput ? 'Use File' : 'Use URL'}
        </Button>
    </div>)
}