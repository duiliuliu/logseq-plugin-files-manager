import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { i18n_FILE_MANAGER_LABEL, i18n_FILE_MANAGER_FEATURE, i18n_FILE_MANAGER_CHANGE_LOG, i18n_AUTHORIZE, i18n_FILE_MANAGER_CHANGE_LOG_LINK, PARENT_OPEN_BUTTON_ID, i18n_HERE, i18n_OPEN_FILE_MANAGER_TIP, i18n_FILE_MANAGER_USE_TIP, PLUGIN_ROUTE } from "../data/constants";
import getI18nConstant from "../i18n/utils";
import './authoItem.css'
import React from 'react';


const AuthoItem: React.FC<{ lang: string }> = ({ lang }) => {
    return (
        <div className="autho-item">
            <p><code>{getI18nConstant(lang, i18n_FILE_MANAGER_LABEL)}</code></p>
            <p>
                <b>{getI18nConstant(lang, i18n_FILE_MANAGER_FEATURE)}</b><br />
                {getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG)}
                <a href={`"${getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG_LINK)}"`}>here</a>.
            </p>
            {/* 授权按钮 */}
            <button id={`"${PARENT_OPEN_BUTTON_ID}"`}>{getI18nConstant(lang, i18n_AUTHORIZE)}</button>
        </div>
    )

}

export const renderAuthoItem = (lang: string): string => {
    const div = document.createElement('div');
    const root = createRoot(div);
    flushSync(() => { root.render(<AuthoItem lang={lang} />); });
    return div.innerHTML
}

export const renderAuthoItem2 = (lang: string): string => {
    return `
        <div className="autho-item">
            <p><code>${getI18nConstant(lang, i18n_FILE_MANAGER_LABEL)}</code></p>
            <p>
                <b>${getI18nConstant(lang, i18n_FILE_MANAGER_FEATURE)}</b><br />
                ${getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG)}
                <a href="${getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG_LINK)}">here</a>.
            </p>
            {/* 授权按钮 */}
            <button id=${`"${PARENT_OPEN_BUTTON_ID}"`}>${getI18nConstant(lang, i18n_AUTHORIZE)}</button>
        </div>
        `
}

export const renderAuthoItem3 = (lang: string): string => {
    // 提前定义变量
    const fileManagerLabel = getI18nConstant(lang, i18n_FILE_MANAGER_LABEL);
    const fileManagerFeature = getI18nConstant(lang, i18n_FILE_MANAGER_FEATURE);
    const fileManagerChangeLog = getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG);
    const fileManagerChangeLogLink = getI18nConstant(lang, i18n_FILE_MANAGER_CHANGE_LOG_LINK);
    const hereText = getI18nConstant(lang, i18n_HERE);
    const buttonId = PARENT_OPEN_BUTTON_ID;
    const clickHereText = getI18nConstant(lang, i18n_OPEN_FILE_MANAGER_TIP)
    const quickUse = getI18nConstant(lang, i18n_FILE_MANAGER_USE_TIP)


    return `
    [:div.autho-item {:id "${buttonId}"}
      [:p [:code "${fileManagerLabel}"]]
      [:p [:b "${fileManagerFeature}"] [:br]
          "${fileManagerChangeLog}"
          [:a {:href "${fileManagerChangeLogLink}"}
              " ${hereText}"]  [:br]
           "${quickUse}" "," [:a {:href "#${PLUGIN_ROUTE}"}
           "${clickHereText}" "."] 
        ]   
    ]`;
};

export default AuthoItem;


