import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import FlexibleCombinedCard from './flexCombineCard'
import { logger } from '@/utils/logger'

export const getdefaultFlexibleLayoutProps = () => {
    const defaultFlexibleLayoutProps: FlexibleLayoutProps = {
        text: "这是另一个示例，展示了内联文本框布局。",
        media: <p>text</p>,
        layout: "inlinetextbox",
        imagePosition: "right"
    }
    return defaultFlexibleLayoutProps
}

export interface FlexibleLayoutProps {
    text: string | React.ReactNode
    media: React.ReactNode
    layout: 'column' | 'row' | 'inline' | 'wrap' | 'float' | 'inlinetextbox'
    imagePosition?: 'left' | 'right'
}

const FlexibleLayout = function Component({
    text,
    media,
    layout = 'column',
    imagePosition = 'left'
}: FlexibleLayoutProps) {
    logger.debug('FlexibleLayout init', layout)
    const renderContent = () => {
        switch (layout) {
            case 'column':
                return (
                    <FlexibleCombinedCard
                        children={imagePosition ? [media, text] : [text, media,]}
                        display='vertical'
                    />
                )
            case 'row':
                return (
                    <FlexibleCombinedCard
                        children={imagePosition ? [media, text] : [text, media,]}
                        display='horizontal'
                    />
                )
            case 'inline':
                return (
                    <div className="flex items-center space-x-4">
                        <span className="inline-block">{media}</span>
                        <p>{text}</p>
                    </div>
                )
            case 'wrap':
                return (
                    <div className={`md:float-${imagePosition} md:max-w-[50%] md:m-4 ${imagePosition === 'right' ? 'md:ml-4' : 'md:mr-4'}`}>
                        {media}
                        <p className="mt-4 md:mt-0">{text}</p>
                    </div>
                )
            case 'float':
                return (
                    <div className="relative">
                        <div className={`md:float-${imagePosition} md:max-w-[50%] md:m-4 ${imagePosition === 'right' ? 'md:ml-4' : 'md:mr-4'}`}>
                            {media}
                        </div>
                        <p>{text}</p>
                    </div>
                )
            case 'inlinetextbox':
                return (
                    <div className="relative">
                        <div className={`md:absolute md:${imagePosition}-0 md:top-0 md:max-w-[50%] md:m-4`}>
                            <Card>
                                <CardContent className="p-4">
                                    <p>{text}</p>
                                </CardContent>
                            </Card>
                        </div>
                        {media}
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            {renderContent()}
        </div>
    )
}

export default FlexibleLayout