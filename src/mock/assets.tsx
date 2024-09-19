import { format } from 'date-fns';

export const MockAssetsData80 = Array.from({ length: 80 }, (_, i) => {
    const names = ['Document', 'Image', 'ProjectPlan', 'MeetingNotes', 'CompanyLogo', 'TeamPhoto', 'ProductDemo', 'EventRecording', 'PodcastEpisode', 'Soundtrack', 'BudgetReport', 'MarketResearch'];
    const extensions = ['pdf', 'png', 'docx', 'jpg', 'mp4', 'mov', 'mp3', 'wav', 'xlsx', 'csv'];
    const sizes = ['2MB', '1.5MB', '1.2MB', '345KB', '450KB', '2.1MB', '14.5MB', '75MB', '8.3MB', '12MB', '512KB', '230KB'];
    const paths = [
        '/path/to/document1.pdf',
        '/path/to/image1.png',
        '/assets/documents/ProjectPlan.pdf',
        '/assets/documents/MeetingNotes.docx',
        '/assets/images/CompanyLogo.png',
        '/assets/images/TeamPhoto.jpg',
        '/assets/videos/ProductDemo.mp4',
        '/assets/videos/EventRecording.mov',
        '/assets/audios/PodcastEpisode1.mp3',
        '/assets/audios/Soundtrack.wav',
        '/assets/documents/BudgetReport.xlsx',
        '/assets/documents/MarketResearch.csv',
    ];

    return {
        name: `${names[i % names.length]}${i + 1}`,
        originalName: `${names[i % names.length]}${i + 1}.${extensions[i % extensions.length]}`,
        extName: extensions[i % extensions.length],
        size: sizes[i % sizes.length],
        formatModifiedTime: format(new Date(`2023-05-0${i % 10 + 1}`), 'yyyy-MM-dd HH:mm:ss'),
        path: paths[i % paths.length],
    };
});

export const MockAssetsData =
    [
        {
            name: 'Document1.pdf',
            originalName: 'Document1.pdf',
            extName: 'pdf',
            size: '2MB',
            formatModifiedTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            path: '/path/to/document1.pdf',
        },
        {
            name: 'Image1.png',
            originalName: 'Image1.png',
            extName: 'png',
            size: '1.5MB',
            formatModifiedTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            path: '/path/to/image1.png',
        },
        {
            name: 'ProjectPlan.pdf',
            originalName: 'ProjectPlan.pdf',
            extName: 'pdf',
            size: '1.2MB',
            formatModifiedTime: '2023-05-01 12:34:56',
            path: '/assets/documents/ProjectPlan.pdf',
        },
        {
            name: 'MeetingNotes.docx',
            originalName: 'MeetingNotes.docx',
            extName: 'docx',
            size: '345KB',
            formatModifiedTime: '2023-05-02 09:21:11',
            path: '/assets/documents/MeetingNotes.docx',
        },
        {
            name: 'CompanyLogo.png',
            originalName: 'CompanyLogo.png',
            extName: 'png',
            size: '450KB',
            formatModifiedTime: '2023-05-03 15:45:30',
            path: '/assets/images/CompanyLogo.png',
        },
        {
            name: 'TeamPhoto.jpg',
            originalName: 'TeamPhoto.jpg',
            extName: 'jpg',
            size: '2.1MB',
            formatModifiedTime: '2023-05-04 10:20:45',
            path: '/assets/images/TeamPhoto.jpg',
        },
        {
            name: 'ProductDemo.mp4',
            originalName: 'ProductDemo.mp4',
            extName: 'mp4',
            size: '14.5MB',
            formatModifiedTime: '2023-05-05 16:59:01',
            path: '/assets/videos/ProductDemo.mp4',
        },
        {
            name: 'EventRecording.mov',
            originalName: 'EventRecording.mov',
            extName: 'mov',
            size: '75MB',
            formatModifiedTime: '2023-05-06 14:30:00',
            path: '/assets/videos/EventRecording.mov',
        },
        {
            name: 'PodcastEpisode1.mp3',
            originalName: 'PodcastEpisode1.mp3',
            extName: 'mp3',
            size: '8.3MB',
            formatModifiedTime: '2023-05-07 08:15:32',
            path: '/assets/audios/PodcastEpisode1.mp3',
        },
        {
            name: 'Soundtrack.wav',
            originalName: 'Soundtrack.wav',
            extName: 'wav',
            size: '12MB',
            formatModifiedTime: '2023-05-08 18:45:10',
            path: '/assets/audios/Soundtrack.wav',
        },
        {
            name: 'BudgetReport.xlsx',
            originalName: 'BudgetReport.xlsx',
            extName: 'xlsx',
            size: '512KB',
            formatModifiedTime: '2023-05-09 11:09:05',
            path: '/assets/documents/BudgetReport.xlsx',
        },
        {
            name: 'MarketResearch.csv',
            originalName: 'MarketResearch.csv',
            extName: 'csv',
            size: '230KB',
            formatModifiedTime: '2023-05-10 13:47:22',
            path: '/assets/documents/MarketResearch.csv',
        },
    ]