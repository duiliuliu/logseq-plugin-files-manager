import React from 'react'
import { Badge } from "@/components/ui/badge"
import { CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Link as LinkIcon, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react"
import CardWithEdit from '../customs/cardWithEdit'
import { format } from 'date-fns'
import { formatSource } from './utils'
import { truncateDescription } from '../customs/description'

const formatCover = (cover: string): string => {
    return cover.split(',').at(0) || cover
}

export const getdefaultExpenseCardProps = () => {
    const defaultProps: ExpenseCardProps = {
        title: "expense_card_title",
        amount: "0",
        time: "",
        location: "beijing",
        category: "",
        cover: "",
        source: "",
        imageposition: "left-image",
        editable: true,
    }
    return defaultProps
}

export interface ExpenseCardProps {
    title?: string
    amount?: string | number
    time?: string
    location?: string
    category?: string
    color?: string
    cover?: string
    source?: string
    description?: string
    platform?: string
    tags?: string
    imageposition?: string
    icon?: string
    displaymode?: string
    editable?: boolean
    onUpdate?: (data: Partial<ExpenseCardProps>) => void
    onEditBlock?: () => void
    onAddBlock?: () => void
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
    displaymode = 'normal',
    editable = true,
    imageposition = 'left-image',
    ...props
}) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)

    const renderContent = (data: ExpenseCardProps,) => (
        <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                    {renderIcon(data.icon)}
                    <CardTitle className="text-lg font-semibold">
                        {data.title || ''}
                    </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1">
                    {renderTags(data.category, data.tags)}
                </div>
            </CardHeader>
            <CardContent className="grid gap-2 text-xs p-4">
                {data.imageposition === 'overlay' && data.cover ? (
                    <div className="relative h-48">
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                        <img src={formatCover(data.cover)} alt={data.title} className="w-full h-full object-cover opacity-30" />
                        <div className="absolute inset-0 text-white p-4">
                            {renderExpenseDetails(data)}
                        </div>
                    </div>
                ) : (
                    <div className={`grid ${data.imageposition?.includes('left') || data.imageposition?.includes('right') ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                        {(data.imageposition === 'left-image' || data.imageposition === 'top-image') && data.cover && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-25"></div>
                                <img src={formatCover(data.cover)} alt={data.title} className="w-full h-auto object-cover" style={{ maxHeight: '200px' }} />
                            </div>
                        )}
                        <div>{renderExpenseDetails(data)}   </div>
                        {(data.imageposition === 'right-image' || data.imageposition === 'bottom-image') && data.cover && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white opacity-25"></div>
                                <img src={formatCover(data.cover)} alt={data.title} className="w-full h-auto object-cover" style={{ maxHeight: '200px' }} />
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
                {data.source && (
                    <a href={formatSource(data.source)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        Source
                    </a>
                )}
            </CardFooter>
        </>
    )

    const renderIcon = (icon?: string) => {
        if (icon === 'shopping-cart') {
            return <ShoppingCart className="w-6 h-6 mr-2" />
        }
        return icon ? <span className="w-6 h-6 mr-2" dangerouslySetInnerHTML={{ __html: icon }} /> : null
    }

    const renderTags = (category?: string, tags?: string) => {
        const categoryTags = Array.isArray(category) ? category : (category?.trim().split(',').map(cat => cat.trim()) || [])
        const tagList = Array.isArray(tags) ? tags : (tags?.trim().split(',').map(tag => tag.trim()) || [])
        return (
            <>
                {categoryTags && categoryTags?.length > 0 && categoryTags.map((cat, index) => (
                    <Badge key={`category-${index}`} variant="secondary">{cat}</Badge>
                ))}
                {tagList && tagList?.length > 0 && tagList.map((tag, index) => (
                    <Badge key={`tag-${index}`} variant="outline">{tag}</Badge>
                ))}
            </>
        )
    }

    const renderExpenseDetails = (data: ExpenseCardProps) => (
        <>
            {data.amount && (
                <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-3 w-4 opacity-70" />
                    <span className="font-medium">{data.amount || 0} 元</span>
                </div>
            )}
            <div className="flex items-center mb-2">
                <Clock className="mr-2 h-3 w-4 opacity-70" />
                <span className="text-muted-foreground">{data.time || format(Date.now(), 'HH:mm')}</span>
            </div>
            {data.location && (
                <div className="flex items-center mb-2">
                    <MapPin className="mr-2 h-3 w-4 opacity-70" />
                    <span>{data.location}</span>
                </div>
            )}
            {data.platform && (
                <div className="flex items-center mb-2">
                    <LinkIcon className="mr-2 h-3 w-4 opacity-70" />
                    <span>{data.platform}</span>
                </div>
            )}
            {data.description && (
                <div className="mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="flex items-center text-xs text-gray-400 p-0 h-6"
                    >
                        {isDescriptionExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                        Description
                    </Button>
                    {isDescriptionExpanded && <p className="text-xs mt-1">{data.description}</p>}
                </div>
            )}
        </>
    )

    const renderCompactMode = (data: ExpenseCardProps) => (
        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    {renderIcon(data.icon)}
                    <CardTitle className="text-base font-semibold">
                        {data.title || ''}
                    </CardTitle>
                </div>
                <div className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4 opacity-70" />
                    <span className="font-medium">{data.amount || 0} 元</span>
                </div>
            </div>
            {data.description && (
                <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                        {isDescriptionExpanded ? data.description : truncateDescription(data.description, 100)}
                    </p>
                    {data.description.length > 100 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            className="text-xs text-primary p-0 h-6 mt-1"
                        >
                            {isDescriptionExpanded ? (
                                <>收起 <ChevronUp className="h-3 w-3 ml-1" /></>
                            ) : (
                                <>展开 <ChevronDown className="h-3 w-3 ml-1" /></>
                            )}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )

    return (
        <CardWithEdit
            data={{ ...props, displaymode, editable, imageposition }}
            renderContent={(data) => data.displaymode === 'compact' ? renderCompactMode(data) : renderContent(data)}
            onUpdate={props.onUpdate}
            onEditBlock={props.onEditBlock}
            onAddBlock={props.onAddBlock}
        />
    )
}

export default ExpenseCard