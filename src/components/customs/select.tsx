import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  icon?: React.ReactNode
}

export function Select({ value, onValueChange, options, icon }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => { document.removeEventListener('mousedown', handleClickOutside); }
  }, [])

  const handleSelect = (newValue: string) => {
    onValueChange(newValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className="relative">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {icon}
          {options.find(option => option.value === value)?.label || 'Select...'}
        </span>
        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}