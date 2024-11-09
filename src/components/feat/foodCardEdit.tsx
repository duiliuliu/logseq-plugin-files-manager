import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Utensils, LinkIcon } from "lucide-react"
import CardWithEdit from '../customs/cardWithEdit'
import { ImageDisplay } from "../customs/imageDisplay"

export const getdefaultFoodCardProps = () => {
    const defaultProps: FoodCardProps = {
        title: "金悦轩",
        description: "鲜虾泡饭和水晶虾饺",
        location: "珠海（拱北或横琴）",
        avgcost: 180,
        category: "粤菜",
        note: "金悦轩的鲜虾泡饭和水晶虾饺都非常美味，推荐尝试。",
        cover: "https://pic.huitu.com/res/20231201/2238480_20231201101706427234_1.jpg"
    }
    return defaultProps
}

export interface FoodCardProps {
    title?: string
    description?: string
    location?: string
    avgcost?: number
    category?: string
    cover?: string
    color?: string
    note?: string
    editable?: boolean
    source?: string
    imageposition?: string
    displaymode?: string
    onUpdate?: (data: Partial<FoodCardProps>) => void
    onEditBlock?: () => void
    onAddBlock?: () => void
}

const FoodCard: React.FC<FoodCardProps> = ({
    displaymode = 'normal',
    editable = true,
    imageposition = 'top-image',
    ...props
}) => {
    const renderContent = (data: FoodCardProps, toggleDisplayMode?: (mode: string) => void) => (
        data.displaymode === 'normal' ? (
            <ImageDisplay cover={data.cover || ''} title={data.title || ''} position={data.imageposition || 'top-image'}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold">
                            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                                {data.title}
                                {data.source && <a href={data.source} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                    <LinkIcon className="ml-1 h-4 w-4 opacity-70" />
                                </a>}
                            </div>
                        </CardTitle>
                        {data.category && <Badge>{data.category}</Badge>}
                    </div>
                    {data.description && (
                        <div className="flex items-center">
                            <Utensils className="mr-2 h-4 w-4 opacity-70 mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{data.description}</span>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="grid gap-4">
                    {data.location && (
                        <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                            <span>{data.location}</span>
                        </div>
                    )}
                    {data.avgcost && (
                        <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                            <span>人均 {data.avgcost} 元</span>
                        </div>
                    )}
                    {data.note && <p className="text-xs">{data.note}</p>}
                </CardContent>
            </ImageDisplay>
        ) : (
            <div className="relative w-full h-40 cursor-pointer"
                onClick={() => toggleDisplayMode && toggleDisplayMode('normal')}// 单击展开紧凑模式
            >
                <img
                    src={data.cover?.split(',')[0]}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <h3 className="text-lg font-semibold">{data.title}</h3>
                </div>
            </div>
        )
    )

    return (
        <CardWithEdit
            data={{ ...props, displaymode, editable, imageposition }}
            renderContent={renderContent}
            onUpdate={props.onUpdate}
            onEditBlock={props.onEditBlock}
            onAddBlock={props.onAddBlock}
        />
    )
}

export default FoodCard