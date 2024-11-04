
export const getColorBg = (color?: string): string => {
    if (!color || color?.trim() === '') {
        return ''
    }
    return colorBgMap[color] || `bg-[${color}]`
}

export const getColor = (color?: string): string | undefined => {
    if (!color || color?.trim() === '') {
        return
    }
    return colorMap[color] || color
}

export const colorBgMap: { [K: string]: string } = {
    green: 'bg-[#e8f6f6]',
    blue: 'bg-[#e8f0f6]',
    pink: 'bg-[#f6e8e8]',
    yellow: 'bg-[#f6f3e8]',
    purple: 'bg-[#e8e6f6]',
    orange: 'bg-[#f6e8d8]',
    red: 'bg-[#f6e8e6]',
    teal: 'bg-[#e8f6e8]',
    brown: 'bg-[#e8d8f6]',
    grey: 'bg-[#d8d8d8]',
    cyan: 'bg-[#e6f6f6]',
    lime: 'bg-[#f6ffe8]',
    magenta: 'bg-[#f6e6f6]',
    navy: 'bg-[#f6f6e8]',
    olive: 'bg-[#e8f6d8]',
    maroon: 'bg-[#f6e8f6]',
    silver: 'bg-[#e8e8f6]',
    gold: 'bg-[#f6e8b8]',
};

export const colorMap: { [K: string]: string } = {
    green: '#e8f6f6',
    blue: '#e8f0f6',
    pink: '#f6e8e8',
    yellow: '#f6f3e8',
    purple: '#e8e6f6',
    orange: '#f6e8d8',
    red: '#f6e8e6',
    teal: '#e8f6e8',
    brown: '#e8d8f6',
    grey: '#d8d8d8',
    cyan: '#e6f6f6',
    lime: '#f6ffe8',
    magenta: '#f6e6f6',
    navy: '#f6f6e8',
    olive: '#e8f6d8',
    maroon: '#f6e8f6',
    silver: '#e8e8f6',
    gold: '#f6e8b8',
};
