// src/mocks.ts

import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user';


export const mockBlocks50 = Array.from({ length: 50 }, (_, i): BlockEntity => {
  return {
    id: i + 1,
    uuid: `uuid-${i + 1}`,
    left: { id: i + 1 },
    format: 'markdown',
    parent: { id: 1 }, // 假设所有块都属于根页面
    unordered: Boolean(Math.random()),
    content: `This is mock block content ${i + 1}.`,
    page: { id: 1 }, // 假设所有块都属于同一页面
    properties: {},
    anchor: `anchor-${i + 1}`,
    body: null,
    children: [],
    container: `container-${i + 1}`,
    file: { id: 1 }, // 假设所有块都属于同一文件
    level: i + 1,
    meta: {
      timestamps: {},
      properties: {},
      startPos: i * 100, // 假设每个块的开始位置是上一个块的结束位置
      endPos: (i + 1) * 100,
    },
    title: [`Mock Block Title ${i + 1}`],
  };
});

export const mockBlocks: BlockEntity[] = [
  {
    id: 1,
    uuid: 'uuid-1',
    left: { id: 1 },
    format: 'markdown',
    parent: { id: 1 },
    unordered: false,
    content: 'This is a mock block content.',
    page: { id: 1 },
    properties: {},
    anchor: 'anchor-1',
    body: null,
    children: [],
    container: 'container-1',
    file: { id: 1 },
    level: 1,
    meta: {
      timestamps: {},
      properties: {},
      startPos: 0,
      endPos: 100,
    },
    title: [],
  },
  {
    id: 2,
    uuid: 'uuid-2',
    left: { id: 2 },
    format: 'markdown',
    parent: { id: 2 },
    unordered: true,
    content: 'Another mock block content.',
    page: { id: 2 },
    properties: {},
    anchor: 'anchor-2',
    body: null,
    children: [],
    container: 'container-2',
    file: { id: 2 },
    level: 2,
    meta: {
      timestamps: {},
      properties: {},
      startPos: 100,
      endPos: 200,
    },
    title: [],
  },
  {
    id: 3,
    uuid: 'uuid-3',
    left: { id: 3 },
    format: 'markdown',
    parent: { id: 3 },
    unordered: true,
    content: '333 mock block content.',
    page: { id: 3 },
    properties: {},
    anchor: 'anchor-3',
    body: null,
    children: [],
    container: 'container-3',
    file: { id: 3 },
    level: 1,
    meta: {
      timestamps: {},
      properties: {},
      startPos: 100,
      endPos: 200,
    },
    title: [],
  },
  // 更多 mock 块...
];