
function addDays(days: number, date = new Date()) {
  date.setDate(date.getDate() + days)

  return date
}

export const MockCardData60 = Array.from({ length: 60 }, (_, i) => ({
  graph: 'logseq_graph',
  name: `Box ${i + 1}`,
  summary: [`Summary ${i + 1} point 1`, `Detail ${i + 1} point 2`],
  image: `image${i + 1}.png`,
  time: addDays(i, new Date(`2023-05-03`)).getTime(), // 循环生成日期
  uuid: `uuid-${i + 1}`,
  originalName: `Box${i + 1}`
}));

export const MockCardData = [
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Box 1',
    summary: ['Summary 1', 'Detail 1'],
    image: 'image1.png',
    time: Date.now(),
    uuid: 'uuid-1',
    originalName: 'Box1'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Box 2',
    summary: ['Summary 2', 'Detail 2'],
    image: 'image2.png',
    time: Date.now(),
    uuid: 'uuid-2',
    originalName: 'Box2'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Project Overview',
    summary: ['Main project dashboard', 'Milestones and deadlines'],
    image: 'project-overview.png',
    time: new Date('2023-05-01').getTime(),
    uuid: 'box-uuid-1',
    originalName: 'ProjectOverview'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Team Roster',
    summary: ['List of team members', 'Contact information', 'Roles and responsibilities'],
    image: 'team-roster.png',
    time: new Date('2023-05-02').getTime(),
    uuid: 'box-uuid-2',
    originalName: 'TeamRoster'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Financial Report',
    summary: ['Quarterly financials', 'Profit and loss statement', 'Budget overview'],
    image: 'financial-report.png',
    time: new Date('2023-05-03').getTime(),
    uuid: 'box-uuid-3',
    originalName: 'FinancialReport'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Market Analysis',
    summary: ['Competitor analysis', 'Market trends', 'Customer demographics'],
    image: 'market-analysis.png',
    time: new Date('2023-05-04').getTime(),
    uuid: 'box-uuid-4',
    originalName: 'MarketAnalysis'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Product Roadmap',
    summary: ['Upcoming features', 'Release schedule', 'Development priorities'],
    image: 'product-roadmap.png',
    time: new Date('2023-05-05').getTime(),
    uuid: 'box-uuid-5',
    originalName: 'ProductRoadmap'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'User Feedback',
    summary: ['Customer testimonials', 'Support tickets', 'Survey results'],
    image: 'user-feedback.png',
    time: new Date('2023-05-06').getTime(),
    uuid: 'box-uuid-6',
    originalName: 'UserFeedback'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Technical Documentation',
    summary: ['API references', 'System architecture', 'Code repositories'],
    image: 'tech-docs.png',
    time: new Date('2023-05-07').getTime(),
    uuid: 'box-uuid-7',
    originalName: 'TechnicalDocs'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Event Calendar',
    summary: ['Conferences', 'Meetups', 'Webinars'],
    image: 'event-calendar.png',
    time: new Date('2023-05-08').getTime(),
    uuid: 'box-uuid-8',
    originalName: 'EventCalendar'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'Legal Documents',
    summary: ['Contracts', 'Agreements', 'Compliance'],
    image: 'legal-docs.png',
    time: new Date('2023-05-09').getTime(),
    uuid: 'box-uuid-9',
    originalName: 'LegalDocuments'
  },
  {
    graph: 'logseq_graph', // 添加 graph 属性
    name: 'HR Policies',
    summary: ['Employee handbook', 'Benefits', 'Onboarding'],
    image: 'hr-policies.png',
    time: new Date('2023-05-10').getTime(),
    uuid: 'box-uuid-10',
    originalName: 'HRPolicies'
  }
];