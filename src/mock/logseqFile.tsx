// src/mocks.ts

// src/mocks.ts
export const mockLogseqFiles70 = Array.from({ length: 70 }, (_, i) => {
  const extension = ['png', 'jpg', 'jpeg', 'pdf', 'docx', 'xlsx', 'pptx'][Math.floor(Math.random() * 7)];
  const isImage = ['png', 'jpg', 'jpeg'].includes(extension);
  const size = isImage ? Math.floor(Math.random() * 5000 + 500) : Math.floor(Math.random() * 2000 + 500);
  const path = `/assets/${isImage ? 'images' : 'documents'}/${i + 1}.${extension}`;
  return {
    path,
    size,
    accessTime: Date.now() - Math.floor(Math.random() * 100000000),
    modifiedTime: Date.now() - Math.floor(Math.random() * 100000000),
    changeTime: Date.now() - Math.floor(Math.random() * 100000000),
    birthTime: Date.now() - Math.floor(Math.random() * 100000000),
  };
});
 
export const mockLogseqFiles = [
    {
      path: '/assets/images/image1.png',
      size: 2048,
      accessTime: Date.now(),
      modifiedTime: Date.now(),
      changeTime: Date.now(),
      birthTime: Date.now(),
    },
    {
      path: '/assets/documents/doc1.pdf',
      size: 1024,
      accessTime: Date.now(),
      modifiedTime: Date.now(),
      changeTime: Date.now(),
      birthTime: Date.now(),
    },
    // 更多 mock 文件...
  ];