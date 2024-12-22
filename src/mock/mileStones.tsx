export const mockMilestones = [
  {
    id: '1',
    content: 'PRD Review [[product-spec]] #planning',
    date: '2024-10-29 10:00:00',
    status: 'DONE',
    links: [
      {
        type: 'page',
        text: 'product-spec',
        href: '#/page/product-spec'
      }
    ],
    tags: ['planning']
  },
  {
    id: '2',
    content: 'Development Sprint Start [Sprint Doc](https://example.com/sprint) #dev',
    date: '2024-11-04 09:00:00',
    status: 'IN-PROGRESS',
    links: [
      {
        type: 'url',
        text: 'Sprint Doc',
        href: 'https://example.com/sprint'
      }
    ],
    tags: ['dev']
  },
  {
    id: '3',
    content: 'Team Meeting [[meeting-notes]] #team',
    date: '2024-11-06 14:00:00',
    status: 'TODO',
    links: [
      {
        type: 'page',
        text: 'meeting-notes',
        href: '#/page/meeting-notes'
      }
    ],
    tags: ['team']
  },
  {
    id: '4',
    content: 'Project kickoff meeting',
    date: '2023-06-15T10:00:00Z',
    status: 'DONE',
    tags: ['important', 'meeting'],
    subContent: [
      'Discuss project goals',
      'Assign initial tasks',
      'Set up communication channels'
    ],
    properties: {
      location: 'Conference Room A',
      duration: '2 hours'
    }
  }
] as const

export const defaultMilestones = [...mockMilestones]