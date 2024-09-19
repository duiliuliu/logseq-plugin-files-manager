
// useTheme.js
import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

const useTheme = (initialTheme: "dark" | "light") => {
    // 使用 localStorage 来持久化主题设置
    const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
 
    useEffect(() => {
        logseq.App.onThemeModeChanged((({ mode }) => {
            logger.debug('onThemeModeChanged',mode)
            setTheme(mode)
        }))
        logseq.App.onThemeChanged((({ mode }) => {
            logger.debug('onThemeChanged',mode)
            if (mode && (mode === "dark" || mode === "light")) {
                setTheme(mode)
            }
        }))
    })


    return [theme];
};

export default useTheme;