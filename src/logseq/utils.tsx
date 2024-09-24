// src/utils.ts
import { BlockEntity, PageEntity, PageIdentity } from '@logseq/libs/dist/LSPlugin';
import { mockLogseqPages, mockLogseqPages90 } from '../mock/logseqPages';
import { mockBlocks50 as mockLogseqBlocks } from '../mock/logseqBlocks';
import { logger } from '../utils/logger';
import { mockLogseqFiles70 } from '../mock/logseqFile';
import { GRAPH_PREFIX } from '../data/constants';

// 获取所有Logseq页面
export const getAllLogseqPages = async (): Promise<PageEntity[] | null> => {
  if (import.meta.env.DEV) {
    // 在开发环境中返回 mock 数据
    logger.debug(`getAllLogseqPages mock,dataLength:${mockLogseqPages90.length}`)
    return mockLogseqPages90;
  } else {
    try {
      const pages = await logseq.Editor.getAllPages();
      logger.debug(`getAllLogseqPages end`)

      return pages;
    } catch (error) {
      logger.error('Failed to get all pages:', error);
      return null;
    }
  }
};

// 获取Logseq树
export const getLogseqPageBlocksTree = async (srcPage: PageIdentity): Promise<BlockEntity[]> => {
  if (import.meta.env.DEV) {
    // 在开发环境中返回 mock 数据
    logger.debug(`getLogseqPageBlocksTree mock,dataLength:${mockLogseqBlocks.length}`)
    return mockLogseqBlocks;
  } else {
    try {
      const blocks = await logseq.Editor.getPageBlocksTree(srcPage);
      logger.debug(`getAllLogseqPages end`)

      return blocks;
    } catch (error) {
      logger.error(`Failed to get page[${srcPage}] blocks tree:`, error);
      return [];
    }
  }
};

// 获取Logseq文件
export const getLogseqFiles = async (): Promise<Array<{
  path: string;
  size: number;
  accessTime: number;
  modifiedTime: number;
  changeTime: number;
  birthTime: number;
}>> => {
  if (import.meta.env.DEV) {
    // 在开发环境中返回 mock 数据
    logger.debug(`getLogseqFiles mock,dataLength:${mockLogseqFiles70.length}`)
    return mockLogseqFiles70;
  } else {
    try {
      const files = await logseq.Assets.listFilesOfCurrentGraph();
      logger.debug(`getLogseqFiles end`)

      return files;
    } catch (error) {
      logger.error('Failed to list files of current graph:', error);
      return [];
    }
  }
};

// 获取指定页面的详细信息
export const getPageDetails = async (srcPage: PageIdentity): Promise<PageEntity | null> => {

  if (import.meta.env.DEV) {
    // 在开发环境中返回 mock 数据
    logger.debug(`getPageDetails mock,data:${mockLogseqPages[0]}`)
    return mockLogseqPages[0];
  } else {
    try {
      const page = await logseq.Editor.getPage(srcPage);
      logger.debug(`getPageDetails end for page: ${srcPage}`);
      return page;
    } catch (error) {
      logger.error(`Failed to get details for page: ${srcPage}`, error);
      throw error;
    }
  }
};


// copy to clipboard
export const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    // clipboard api 复制
    navigator.clipboard.writeText(text);
  } else {
    var textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    // 赋值
    textarea.value = text;
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
    // 移除输入框
    document.body.removeChild(textarea);
  }
}

export const buildGraphPath = (graph?: string) => {
  if (graph) return graph.replace(GRAPH_PREFIX, '')
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}