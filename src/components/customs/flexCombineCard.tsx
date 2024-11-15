import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

interface FlexibleCombinedCardProps {
    children: [React.ReactNode, React.ReactNode]
    display?: 'vertical' | 'horizontal'
}

const FlexibleCombinedCard = function FlexibleCombinedCard({
    children,
    display = 'vertical'
}: FlexibleCombinedCardProps) {
    if (children.length !== 2) {
        throw new Error('FlexibleCombinedCard must have exactly two children')
    }

    return (
        <Card className="w-full max-w-2xl mx-auto overflow-hidden">
            <CardContent className={`p-0 ${display === 'horizontal' ? 'md:flex' : ''}`}>
                <div className={`${display === 'horizontal' ? 'md:w-1/2' : 'w-full'}`}>
                    {children[0]}
                </div>
                <div className={`${display === 'horizontal' ? 'md:w-1/2' : 'w-full'}`}>
                    {children[1]}
                </div>
            </CardContent>
        </Card>
    )
}

export default FlexibleCombinedCard;