import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns";
import { MapPin, Clock, DollarSign, Utensils, HelpCircle } from "lucide-react"
import { getColor, getColorBg } from "./color";


export const getdefaultExpenseCardProps = () => {
    const defaultProps: ExpenseCardProps = {
        title: "expense_card_title",
        amount: "0",
        time: "HH:mm",
        location: "string",
        category: "string"
    }
    return defaultProps
}

export type ExpenseCardProps = {
    title?: string;
    amount?: string;
    time?: string;
    location?: string;
    category?: string;
    color?: 'green' | 'blue' | 'pink' | 'yellow' | ''
}

const ExpenseCard = function Component({
    title,
    amount,
    time,
    location,
    category,
    color = ''
}: ExpenseCardProps = {}) {
    const redactedStyle = "bg-gray-300 text-transparent rounded select-none";

    return (
        <Card className={`w-full max-w-md mx-auto ${getColorBg(color)}`} style={{ backgroundColor: getColor(color) }}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    {title || <span className={redactedStyle}>马赛克标题</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    {amount ? (
                        <span className="font-medium">{amount} 元</span>
                    ) : (
                        <span className={redactedStyle}>马赛克金额</span>
                    )}
                </div>
                <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 opacity-70" />
                    {time ? (
                        <span>{time}</span>
                    ) : (
                        <span className="text-muted-foreground">{format(new Date(), "HH:mm")}</span>
                    )}
                </div>
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 opacity-70" />
                    {location ? (
                        <span>{location}</span>
                    ) : (
                        <span className={redactedStyle}>马赛克地点</span>
                    )}
                </div>
                <div className="flex items-center">
                    {category ? (
                        <>
                            <Utensils className="mr-2 h-4 w-4 opacity-70" />
                            <span>{category}</span>
                        </>
                    ) : (
                        <>
                            <HelpCircle className="mr-2 h-4 w-4 opacity-70" />
                            <span className={redactedStyle}>马赛克类别</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ExpenseCard;