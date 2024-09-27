import { logger } from "./logger";


// 下划线转换驼峰
function toSmallCamel(val: string) {
    return val.replace(/-(\w)/g, (_all, letter) => letter.toUpperCase())
}

// 对象属性转换驼峰
export const objUnderlineToSmallCamel = (objSrc: any, _char = '_' /** todo */) => {
    const objDest = new Object()
    Object.keys(objSrc).forEach(item => {
        // @ts-ignore
        objDest[toSmallCamel(item)] = objSrc[item];
    })
    logger.debug('objUnderlineToSmallCamel', objDest)
    return objDest;
}