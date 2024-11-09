const regexWithoutPrifix = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

function isHexColorCodeWithoutPrefix(color: string) {
    return regexWithoutPrifix.test(color);
}

export const getColorBg = (color?: string): string => {
    if (!color || color?.trim() === '') {
        return ''
    }
    if (isHexColorCodeWithoutPrefix(color)) {
        return `bg-[#${color}]`
    }
    return colorBgMap[color] || `bg-[${color}]`
}

export const getColor = (color?: string): string | undefined => {
    if (!color || color?.trim() === '') {
        return
    }
    if (isHexColorCodeWithoutPrefix(color)) {
        return `#${color}`
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
    white: 'bg-[#ffffff]',
    black: 'bg-[#000000]',
    skyblue: 'bg-[#e6f7ff]',
    deepblue: 'bg-[#001529]',
    indigo: 'bg-[#4b79cf]',
    violet: 'bg-[#b083fc]',
    plum: 'bg-[#de6ebd]',
    rose: 'bg-[#f7a1a1]',
    peach: 'bg-[#fbb8b8]',
    mint: 'bg-[#d1f2eb]',
    jade: 'bg-[#b5e8b9]',
    forest: 'bg-[#6ca57c]',
    grass: 'bg-[#a3d69c]',
    sand: 'bg-[#f5e7d8]',
    beige: 'bg-[#f6e6d8]',
    cream: 'bg-[#f7f3e3]',
    crimson: 'bg-[#d91b1b]',
    scarlet: 'bg-[#d94e1b]',
    rust: 'bg-[#bd5d38]',
    bronze: 'bg-[#c07a4d]',
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
    white: '#ffffff',
    black: '#000000',
    skyblue: '#e6f7ff',
    deepblue: '#001529',
    indigo: '#4b79cf',
    violet: '#b083fc',
    plum: '#de6ebd',
    rose: '#f7a1a1',
    peach: '#fbb8b8',
    mint: '#d1f2eb',
    jade: '#b5e8b9',
    forest: '#6ca57c',
    grass: '#a3d69c',
    sand: '#f5e7d8',
    beige: '#f6e6d8',
    cream: '#f7f3e3',
    crimson: '#d91b1b',
    scarlet: '#d94e1b',
    rust: '#bd5d38',
    bronze: '#c07a4d',
};
