
// src/utils.ts

import { format, isValid, parse } from 'date-fns';


export const getTimeString = (unixTime: number) => {
    const date = new Date(unixTime);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

/**
 * 检查给定的日期字符串是否符合 yyyy-MM-dd 格式。
 * 
 * @param dateString - 要检查的日期字符串。
 * @returns 如果日期字符串有效，返回 true；否则返回 false。
 */
export const isValidDate = (dateString: string, dateFormat: string): boolean => {
    const parsedDate = parse(dateString, dateFormat, new Date());
    return isValid(parsedDate) && format(parsedDate, dateFormat) === dateString;
}