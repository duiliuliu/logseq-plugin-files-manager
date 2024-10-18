
// useTheme.js
import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';


const initParentThemeStyle = () => {
    logger.debug('initParentThemeStyle')
    const barkgroupColor = getComputedStyle(parent?.document?.body).getPropertyValue("background-color");
    document.body.style.setProperty('--ls-primary-background-color', barkgroupColor);
    const textColor = getComputedStyle(parent?.document?.body).getPropertyValue("text-decoration-color");
    document.body.style.setProperty('--ls-primary-text-color', textColor);
    const textSecondColor = getComputedStyle(parent?.document?.body).getPropertyValue("text-emphasis-color");
    document.body.style.setProperty('--ls-secondary-text-color', textSecondColor);
    const boderColor = getComputedStyle(parent?.document?.body).getPropertyValue("border-block-color");
    document.body.style.setProperty('--ls-border-color', boderColor);
}

const useTheme = (initialTheme: "dark" | "light") => {
    const [theme, setTheme] = useState<"dark" | "light">(initialTheme);

    const setThemeBymode = (mode: any) => {
        logger.debug('onThemeChanged', mode)
        if (mode && (mode === "dark" || mode === "light") && mode != theme) {
            setTheme(mode)
            document.querySelector('html')?.setAttribute('data-theme', mode);
        }
        document.querySelector('html')?.setAttribute('data-color', parent?.document?.querySelector('html')?.getAttribute('data-color') || 'logseq');
        initParentThemeStyle()
    }

    useEffect(() => {
        setThemeBymode(initialTheme)
        logseq.App.onThemeModeChanged((({ mode }) => { setThemeBymode(mode) }))
        logseq.App.onThemeChanged((({ mode }) => { setThemeBymode(mode) }))
    }, [initialTheme])

    return [theme];
};

export default useTheme;