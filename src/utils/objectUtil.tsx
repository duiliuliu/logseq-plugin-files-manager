import { CustomVariable } from "../logseq/logseqSetting";
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

export const objectTemplateFromat = (temp: string, obj: Object): string => {
    return new Function(...Object.keys(obj), `return \`${temp}\`;`)(...Object.values(obj))
}

export const stringToFuncValue = (str: string, obj: Object): string => {
    return new Function(...Object.keys(obj), "return " + str)(...Object.values(obj))
}

export const stringToObject = (str: string): Object => {
    return (new Function("return " + str))();
}

export const stringToVarArr = (str: string): Array<CustomVariable> => {
    return (new Function("return " + str))();
}

export const stringToStrArr = (str: string): Array<string> => {
    return (new Function("return " + str))();
}

export function isEmptyObject(obj: Object) { return Object.keys(obj).length === 0 }
