import Dexie from 'dexie';
import { DataItem } from './types';
import { logger } from '../utils/logger';

class DataDexie extends Dexie {
    data!: Dexie.Table<DataItem>;

    constructor() {
        super('logseq-file-manager-plugin');
        this.version(1).stores({
            data: '[name], graph, dataType,updatedTime'
        });
    }
}

export const DB = new DataDexie();

// 工具函数：移除页面记录
export const removePageFromDB = async (graph: any, name: string) => {
    logger.debug(`Removing page from DB: graph=${graph}, name=${name}`);
    await DB.data.delete([ name]);
};


// const fuseOptions = {
//     // isCaseSensitive: false, // 指示比较是否应区分大小写。
//     // includeScore: true, // 分数是否应包含在结果集中。分数0表示完全匹配，分数1表示完全不匹配。
//     // shouldSort: true, // 是否按分数对结果列表进行排序。
//     // includeMatches: true, // 匹配是否应包含在结果集中。当 时true，结果集中的每条记录都将包含匹配字符的索引。因此，这些可以用于突出显示的目的。
//     // findAllMatches: true, // 当为 true 时，匹配函数将继续到搜索模式的末尾，即使已在字符串中找到完美匹配。
//     // minMatchCharLength: 1, // 仅返回长度超过该值的匹配项。（例如，如果您想忽略结果中的单个字符匹配，请将其设置为2）。
//     // location: 0, // 确定预期在文本中找到的模式的大概位置。
//     // threshold: 0.6, // 匹配算法在什么时候放弃。阈值0.0需要完美匹配（字母和位置），阈值1.0可以匹配任何内容
//     // distance: 100, // 确定匹配与模糊位置的接近程度（由 指定location）。distance远离模糊位置的字符的精确字母匹配将被评分为完全不匹配。A distanceof0要求匹配精确指定location。距离1000需要在使用of找到的800字符内有完美匹配。locationthreshold0.8
//     // ignoreLocation: true, // true，搜索将忽略location和distance，因此模式出现在字符串中的位置并不重要。
//     // ignoreFieldNorm: true, //true，相关性得分（用于排序）的计算将忽略字段长度范数。
//     // fieldNormWeight: 1, // 确定字段长度范数对评分的影响程度。值0相当于忽略字段长度范数。值0.5将大大降低字段长度范数的影响，而值2.0将大大增加字段长度范数的影响。
//     keys: ['name'],
// };

// export const ES = new Fuse([] as DataItem[], fuseOptions)


