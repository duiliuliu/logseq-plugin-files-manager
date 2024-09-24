import { logger } from "../utils/logger"


export function doInitNotifyUser(showMsg: () => void) {
    logger.debug('logseq.updateSettings', logseq.settings, 'logseq.baseInfo.version', logseq.baseInfo.version)

    if (!logseq.settings!.notifications) { logseq.settings!.notifications = {} }

    const notifications: { [key: string]: any } = logseq.settings!.notifications as object

    const currentPluginVersion = logseq.baseInfo.version
    const previousPluginVersion = notifications.previousPluginVersion
    const previousPluginNotify = notifications.previousNotifyTime

    // Notify only old users
    const shouldNotifyBasedOnVersion = (previousPluginVersion: string, currentPluginVersion: string) =>
        previousPluginVersion && currentPluginVersion !== previousPluginVersion;
    const shouldNotifyBasedOnTime = (previousPluginNotify: number) =>
        previousPluginNotify && (Date.now() - previousPluginNotify) > 15 * 24 * 60 * 60 * 1000;

    if (shouldNotifyBasedOnVersion(previousPluginVersion, currentPluginVersion) ||
        shouldNotifyBasedOnTime(previousPluginNotify)) {
        showMsg();
        logseq.updateSettings({ notifications: { previousNotifyTime: Date.now() } });
    }

    logseq.updateSettings({ notifications: { previousPluginVersion: currentPluginVersion } })
}
