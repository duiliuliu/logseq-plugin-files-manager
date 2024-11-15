export const truncateDescription = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}