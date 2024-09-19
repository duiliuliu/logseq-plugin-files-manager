// src/mocks.ts

import { PageEntity } from '@logseq/libs/dist/LSPlugin.user'; 

export const mockLogseqPages90: PageEntity[] = Array.from({ length: 90 }, (_, i) => {
  const id = i + 1;
  const uuid = `uuid-${id}`;
  const name = `Page ${id}`;
  const originalName = name;
  const namespaceId = 100;
  const fileId = 101 + id;

  return {
    id,
    uuid,
    name,
    originalName,
    'journal?': false,
    file: { id: fileId },
    namespace: { id: namespaceId },
    children: [],
    properties: {},
    format: 'markdown',
    journalDay: new Date().setFullYear(new Date().getFullYear() - 1), // Set journalDay to one year ago
    updatedAt: Date.now() - id * 100000, // Decrease update time for each page
  };
});
 
 
export const mockLogseqPages: PageEntity[] = [
  {
    id: 1,
    uuid: 'uuid-1',
    name: 'Page 1',
    originalName: 'Page 1',
    'journal?': false,
    file: { id: 101 },
    namespace: { id: 100 },
    children: [],
    properties: {},
    format: 'markdown',
    journalDay: 20240903,
    updatedAt: Date.now(),
  },
  {
    id: 2,
    uuid: 'uuid-2',
    name: 'Page 2',
    originalName: 'Page 2',
    'journal?': false,
    file: { id: 102 },
    namespace: { id: 100 },
    children: [],
    properties: {},
    format: 'markdown',
    journalDay: 20240906,
    updatedAt: Date.now(),
  },
  // 更多 mock 页面...
];