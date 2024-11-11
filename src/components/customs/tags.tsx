
import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export const renderTags = (categories?: string, tags?: string) => {
    const categoryTags = Array.isArray(categories) ? categories : (categories?.trim().split(',').map(cat => cat.trim()))?.filter(cat => cat);
    const tagList = Array.isArray(tags) ? tags : (tags?.trim().split(',').map(tag => tag.trim()))?.filter(cat => cat);
    return (
        (categories || tags) &&
        <div className="flex flex-wrap gap-1">
            {categoryTags && categoryTags?.length > 0 && categoryTags.map((cat, index) => (
                <Badge key={`category-${index}`} variant="secondary">{cat}</Badge>
            ))}
            {tagList && tagList?.length > 0 && tagList.map((tag, index) => (
                <Badge key={`tag-${index}`} variant="outline">{tag}</Badge>
            ))}
        </div>
    )
}

interface TagsProps {
    categories?: string
    tags?: string
    maxInitialTags?: number
}

const Tags: React.FC<TagsProps> = ({ categories = "", tags = "", maxInitialTags = 3 }) => {
    const [showAllTags, setShowAllTags] = useState(false)

    const categoryTags = categories.split(',').map(cat => cat.trim()).filter(Boolean)
    const tagList = tags.split(',').map(tag => tag.trim()).filter(Boolean)
    const allTags = [...categoryTags, ...tagList]
    const visibleTags = showAllTags ? allTags : allTags.slice(0, maxInitialTags)

    return (
        <div className="flex flex-wrap gap-1 items-center">
            {visibleTags.map((tag, index) => (
                <Badge
                    key={`tag-${index}`}
                    variant={index < categoryTags.length ? "secondary" : "outline"}
                >
                    {tag}
                </Badge>
            ))}
            {allTags.length > maxInitialTags && !showAllTags && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllTags(true)}
                    className="text-xs text-primary p-0 h-6"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

export default Tags