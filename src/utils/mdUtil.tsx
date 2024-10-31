import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import { markdownItTable } from 'markdown-it-table';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import MarkdownItCollapsible from "markdown-it-collapsible";


// 创建一个新的 markdown-it 实例并注册插件
const md = new MarkdownIt()
    .use(markdownItFootnote)       // 添加脚注插件
    .use(markdownItTable)          // 添加表格插件
    .use(markdownItHighlightjs)   // 添加高亮插件
    .use(MarkdownItCollapsible); // 添加折叠插件

export const reanderMd = (text: string) => {
    return md.render(text);
}