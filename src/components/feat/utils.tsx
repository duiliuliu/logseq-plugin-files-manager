export const formatSource = (input?: string,) => {
    // 去除字符串两端的空白字符
    input = input?.trim();
    if (!input) {
        return
    }

    if (input.startsWith('[[')) {
        return '#/page/' + input.replace('[[', '').replace(']]', '')
    }

    // 如果不匹配任何已知格式，返回原字符串
    return input;
}
