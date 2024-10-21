

export const openItemInFolder = async (path: string) => {
    return await logseq.App.showItemInFolder(path)
}

export const openItemInFolder2 = async (path: string) => {
    return await logseq.App.invokeExternalCommand('logseq.editor/open-file-in-directory', path)
}

export const dirhandlerRemoveFile = async (fileName: string, assetdirHandler: FileSystemDirectoryHandle | null) => {
    if (!assetdirHandler) {
        throw Error('assetDirectoryHandler is null')
    }
    await assetdirHandler.removeEntry(fileName)
}

export const dirhandlerRemoveFile2 = async (fileName: string) => {
    await logseq.caller.callAsync(`api:call`, {
        method: 'unlink-plugin-storage-file',
        args: ["../../", fileName, true]
    })
}

export const dirhandlerRemoveFile3 = async (fileName: string) => {
    await logseq.caller.callAsync(`api:call`, {
        method: 'unlink_plugin_storage_file',
        args: ["../../", fileName, true]
    })
}
