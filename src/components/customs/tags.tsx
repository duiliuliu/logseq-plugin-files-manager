
import { Badge } from "@/components/ui/badge"

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