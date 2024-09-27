import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";
import { i18n_DEFAULT_DELETE_FORMAT, i8n_DELETE_FORMAT_DESC, i8n_DELETE_FORMAT_TITLE, i8n_DELETE_FORMAT_VAR_DESC } from "../data/constants";
import getI18nConstant from "../i18n/utils";

interface Notification {
    previousPluginVersion: string;
    previousNotifyTime: number;
}

export interface Settings {
    disabled: boolean;
    notifications: Notification;
    deleteFormart: string
}

export const getLspDeleteFormat = async (lang?: string): Promise<string> => {
    const setting = await logseq.settings
    return setting?.deleteFormart ?? getI18nConstant(lang || 'en', i18n_DEFAULT_DELETE_FORMAT)
}
export const initLspSettingSchema = async (lang?: string) => {
    const { language } = lang ? { language: lang } : await logseq.App.getUserConfigs()

    const schemas: SettingSchemaDesc[] = [
        {
            key: "deleteFormart",
            title: getI18nConstant(language, i8n_DELETE_FORMAT_TITLE),
            type: "string",
            default: getI18nConstant(language, i18n_DEFAULT_DELETE_FORMAT),
            description: getI18nConstant(language, i8n_DELETE_FORMAT_DESC) + ',' + getI18nConstant(language, i8n_DELETE_FORMAT_VAR_DESC) + ":${name}\\${date}\\${time}",
        },
    ]

    logseq.useSettingsSchema(schemas)
}

