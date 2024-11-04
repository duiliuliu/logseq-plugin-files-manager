
function compareVersions(version1: string, version2: string) {
    // 将版本号分割成数字数组
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    // 比较每个对应的数字
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
        // 如果一个版本号在某个位置没有数字，我们假设它是0
        const num1 = v1[i] || 0;
        const num2 = v2[i] || 0;

        // 如果数字不相等，返回比较结果
        if (num1 > num2) {
            return 1;
        } else if (num1 < num2) {
            return -1;
        }
    }

    // 如果所有对应的数字都相等，返回0
    return 0;
}

export const showMainUI = async () => {
    const appInfo = await logseq.App.getInfo()
    if (appInfo && compareVersions(appInfo?.version || '0.10.9', '0.10.7') === -1) {
        showUI(1001)
    } else {
        showUI(2)
    }
}

export const showCardUI = async () => {
    showUI(-1)
}

export const showUI = (zIndex?: number) => {
    logseq.showMainUI()
    zIndex && logseq.setMainUIInlineStyle({
        zIndex: zIndex,
    })
}
