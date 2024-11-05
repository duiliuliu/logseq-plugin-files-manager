import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Utensils } from "lucide-react"

import { getColor, getColorBg } from "./color"

export const getdefaultFoodCardProps = () => {
  const defaultProps: FoodCardProps = {
    title: "金悦轩",
    description: "鲜虾泡饭和水晶虾饺",
    location: "珠海（拱北或横琴）",
    avgCost: 180,
    category: "粤菜",
    recommendation: "金悦轩的鲜虾泡饭和水晶虾饺都非常美味，推荐尝试。",
    cover: "https://pic.huitu.com/res/20231201/2238480_20231201101706427234_1.jpg"
  }
  return defaultProps
}

export interface FoodCardProps {
  title?: string
  description?: string
  location?: string
  avgCost?: number
  category?: string
  recommendation?: string
  cover?: string
  color?: string
  editable?: boolean
  onUpdate?: (updatedData: Partial<FoodCardProps>) => void
}

const FoodCard = function Component({
  title = "金悦轩",
  description = "鲜虾泡饭和水晶虾饺",
  location = "珠海",
  avgCost = 180,
  category = "粤菜",
  recommendation = "金悦轩的鲜虾泡饭和水晶虾饺都非常美味，推荐尝试。",
  cover = "/placeholder.svg?height=200&width=400",
  color = ''
}: FoodCardProps) {
  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }}>
      {cover && (
        <div className="relative w-full h-20">
          <img src={cover} alt={`${title} cover`} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          {category && <Badge>{category}</Badge>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">特色菜：{description}</p>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {location && (
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 opacity-70" />
            <span>{location}</span>
          </div>
        )}
        {avgCost && (
          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 opacity-70" />
            <span>人均 {avgCost} 元</span>
          </div>
        )}
        {recommendation && (
          <div className="flex items-start">
            <Utensils className="mr-2 h-4 w-4 opacity-70 mt-1 flex-shrink-0" />
            <p className="text-sm">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default FoodCard