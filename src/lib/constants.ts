import { TimelineNode, MediaContent } from '@/types';
import { generateContentDateForFilter } from '@/utils/dateUtils';

/**
 * Timeline nodes for About Us page
 */
export const TIMELINE_NODES: TimelineNode[] = [
  {
    id: 'genesis',
    label: 'Genesis',
    title: 'The Spark of an Idea',
    description: 'It all started with a simple observation: communities are strongest when they combine purpose with passion. After years of watching amazing groups struggle with fragmented tools and disconnected platforms, we knew there had to be a better way. The idea for Kamunity was born from the belief that technology should amplify human connection, not complicate it.',
    icon: '💡'
  },
  {
    id: 'research',
    label: 'Research',
    title: 'Understanding Real Needs',
    description: 'We spent months talking to community leaders, club organizers, and passionate individuals who were trying to make a difference. From neighborhood groups to professional associations, from hobby clubs to advocacy organizations - we listened, learned, and discovered the common challenges everyone was facing. This research became the foundation for everything we\'re building.',
    icon: '🔍'
  },
  {
    id: 'design',
    label: 'Design',
    title: 'Crafting with Care',
    description: 'Every feature, every interaction, every pixel has been thoughtfully designed with real communities in mind. We\'re not just building software; we\'re creating an experience that feels natural, inclusive, and empowering. Our design philosophy centers on simplicity without sacrificing functionality, and accessibility for everyone.',
    icon: '🎨'
  },
  {
    id: 'build',
    label: 'Build',
    title: 'Bringing Ideas to Life',
    description: 'With a clear vision and user-centered design, we\'re now in the exciting phase of bringing Kamunity to life. Using cutting-edge technology while maintaining our focus on security, privacy, and performance, we\'re building a platform that communities can depend on for years to come.',
    icon: '🔨'
  },
  {
    id: 'launch',
    label: 'Launch',
    title: 'Community Beta Phase',
    description: 'We\'re preparing for our community beta phase, where we\'ll work closely with select communities to refine and perfect the Kamunity experience. This isn\'t just about testing - it\'s about partnership. Together, we\'ll shape the future of community building.',
    icon: '🚀'
  },
  {
    id: 'vision',
    label: 'Vision',
    title: 'The Future We\'re Building',
    description: 'We envision a world where every community - no matter how big or small - has the tools and support they need to thrive. Where connection transcends geography, where collaboration is effortless, and where positive change happens naturally when good people come together with shared purpose.',
    icon: '🌟'
  }
];

export const SAMPLE_MEDIA_CONTENT: MediaContent[] = [
  // FEATURED CONTENT (Keep these as featured for home page)
  {
    id: '1',
    title: 'Welcome to Kamunity',
    description: 'Discover how our community-first approach is changing the way people connect and collaborate.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/kamunity-logo.png',
    author: 'Kamunity Team',
    date: generateContentDateForFilter('TODAY', 0),
    tags: ['community', 'introduction', 'welcome'],
    featured: true,
    timePeriod: 'TODAY',
    perspective: 'NICE',
    logoCard: true
  },
  {
    id: '2',
    title: 'This hat is not for sale',
    description: 'While we want to make the community great again, its not a slogan or a merchandising opportunity...',
    type: 'blog',
    contentUrl: '/content/building-communities',
    thumbnailUrl: '/images/not-for-sale.png',
    author: 'Community Team',
    date: generateContentDateForFilter('TODAY', 0),
    tags: ['community', 'philosophy', 'values'],
    featured: true,
    timePeriod: 'TODAY',
    perspective: 'FACTUAL'
  },
  {
    id: '3',
    title: 'The Future of Digital Spaces',
    description: 'Exploring how technology can bring people together rather than drive them apart.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example',
    thumbnailUrl: '/character-mascot.png',
    author: 'Tech Talk Team',
    date: generateContentDateForFilter('TODAY', 0),
    duration: '35:20',
    tags: ['technology', 'future', 'digital'],
    featured: true,
    timePeriod: 'TODAY',
    perspective: 'CURIOUS'
  },

  // TODAY CONTENT - Additional items for complete coverage
  {
    id: '4',
    title: 'Dancing Through Debug Sessions',
    description: 'Why our developer started doing the Macarena every time they fix a bug, and the surprisingly positive results.',
    type: 'blog',
    contentUrl: '/content/dancing-debug',
    thumbnailUrl: '/character-mascot.png',
    author: 'Comedy Club',
    date: generateContentDateForFilter('TODAY', 0),
    tags: ['humor', 'development', 'wellness'],
    featured: false,
    timePeriod: 'TODAY',
    perspective: 'FUN'
  },
  {
    id: '5',
    title: 'Monthly Security Update - December 2024',
    description: 'Important security enhancements and policy updates affecting all community members.',
    type: 'post',
    contentUrl: '/updates/security-december',
    thumbnailUrl: '/logo.svg',
    author: 'Security Team',
    date: generateContentDateForFilter('TODAY', 0),
    tags: ['security', 'updates', 'policy'],
    featured: false,
    timePeriod: 'TODAY',
    perspective: 'FACTUAL'
  },
  {
    id: '6',
    title: 'Coding in Complete Darkness Challenge',
    description: 'One member tried coding with their monitor off for a week. The results will surprise you.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example6',
    thumbnailUrl: '/character-mascot.png',
    author: 'Experiment Lab',
    date: generateContentDateForFilter('TODAY', 0),
    duration: '18:45',
    tags: ['experiment', 'coding', 'challenge'],
    featured: false,
    timePeriod: 'TODAY',
    perspective: 'UNUSUAL'
  },
  {
    id: '7',
    title: 'Why Do We Build Communities?',
    description: 'A deep dive into the psychology and philosophy behind human community formation in digital spaces.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example7',
    thumbnailUrl: '/character-mascot.png',
    author: 'Philosophy Hour',
    date: generateContentDateForFilter('TODAY', 0),
    duration: '42:15',
    tags: ['philosophy', 'psychology', 'community'],
    featured: false,
    timePeriod: 'TODAY',
    perspective: 'CURIOUS'
  },
  {
    id: '8',
    title: 'The Truth About AI Ethics in Community Moderation',
    description: 'Controversial take: Why AI-driven content moderation might be doing more harm than good.',
    type: 'blog',
    contentUrl: '/content/ai-ethics-spicy',
    thumbnailUrl: '/character-mascot.png',
    author: 'Ethics Debate',
    date: generateContentDateForFilter('TODAY', 0),
    tags: ['ai', 'ethics', 'moderation', 'controversial'],
    featured: false,
    timePeriod: 'TODAY',
    perspective: 'SPICY'
  },

  // LAST WEEK CONTENT
  {
    id: '9',
    title: 'Community Game Night Highlights',
    description: 'Relive the best moments from our weekly virtual game night, featuring some epic fails and victories.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example9',
    thumbnailUrl: '/character-mascot.png',
    author: 'Gaming Squad',
    date: generateContentDateForFilter('LAST WEEK', 2),
    duration: '25:30',
    tags: ['gaming', 'community', 'fun'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FUN'
  },
  {
    id: '10',
    title: 'New Member Onboarding Process Updated',
    description: 'We have streamlined our welcome process based on feedback from recent surveys.',
    type: 'post',
    contentUrl: '/updates/onboarding-update',
    thumbnailUrl: '/logo.svg',
    author: 'Admin Team',
    date: generateContentDateForFilter('LAST WEEK', 3),
    tags: ['onboarding', 'process', 'improvement'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FACTUAL'
  },
  {
    id: '11',
    title: 'Member Uses Minecraft to Plan Their Wedding',
    description: 'How one creative couple used block-building skills to design their perfect wedding venue.',
    type: 'blog',
    contentUrl: '/content/minecraft-wedding',
    thumbnailUrl: '/character-mascot.png',
    author: 'Creative Corner',
    date: generateContentDateForFilter('LAST WEEK', 4),
    tags: ['creativity', 'minecraft', 'wedding', 'unique'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'UNUSUAL'
  },
  {
    id: '12',
    title: 'What Makes a Digital Community Truly Inclusive?',
    description: 'Exploring the subtle design choices that can make or break accessibility in online spaces.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example12',
    thumbnailUrl: '/character-mascot.png',
    author: 'Inclusion Talk',
    date: generateContentDateForFilter('LAST WEEK', 5),
    duration: '38:20',
    tags: ['inclusion', 'accessibility', 'design'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'CURIOUS'
  },
  {
    id: '13',
    title: 'Should Community Moderators Be Paid?',
    description: 'The ongoing debate about compensating volunteer moderators splits the community.',
    type: 'blog',
    contentUrl: '/content/moderator-payment-debate',
    thumbnailUrl: '/character-mascot.png',
    author: 'Debate Club',
    date: generateContentDateForFilter('LAST WEEK', 1),
    tags: ['moderation', 'compensation', 'debate'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'SPICY'
  },
  {
    id: '14',
    title: 'Random Acts of Code Kindness',
    description: 'Heartwarming stories of developers helping each other solve problems, no questions asked.',
    type: 'post',
    contentUrl: '/content/code-kindness',
    thumbnailUrl: '/character-mascot.png',
    author: 'Kindness Team',
    date: generateContentDateForFilter('LAST WEEK', 6),
    tags: ['kindness', 'coding', 'help', 'community'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'NICE'
  },

  // Additional LAST WEEK content for coverage
  {
    id: '15',
    title: 'Epic Meme Monday Compilation',
    description: 'The best tech memes from this weeks Meme Monday thread, guaranteed to make you laugh.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example15',
    thumbnailUrl: '/character-mascot.png',
    author: 'Meme Team',
    date: generateContentDateForFilter('LAST WEEK', 1),
    duration: '12:15',
    tags: ['memes', 'humor', 'compilation'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FUN'
  },
  {
    id: '16',
    title: 'Community Growth Metrics - December',
    description: 'Transparent reporting on our community growth, engagement rates, and key performance indicators.',
    type: 'blog',
    contentUrl: '/reports/december-metrics',
    thumbnailUrl: '/logo.svg',
    author: 'Analytics Team',
    date: generateContentDateForFilter('LAST WEEK', 2),
    tags: ['metrics', 'growth', 'transparency'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FACTUAL'
  },

  // LAST MONTH CONTENT
  {
    id: '17',
    title: 'Thanksgiving Gratitude Thread Highlights',
    description: 'The most touching and funny gratitude posts from our Thanksgiving community thread.',
    type: 'post',
    contentUrl: '/content/thanksgiving-gratitude',
    thumbnailUrl: '/character-mascot.png',
    author: 'Community Team',
    date: generateContentDateForFilter('LAST MONTH', 15),
    tags: ['gratitude', 'thanksgiving', 'community'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'NICE'
  },
  {
    id: '18',
    title: 'Halloween Costume Contest Winners',
    description: 'Check out the most creative tech-themed Halloween costumes from our community contest.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example18',
    thumbnailUrl: '/character-mascot.png',
    author: 'Contest Team',
    date: generateContentDateForFilter('LAST MONTH', 20),
    duration: '15:45',
    tags: ['halloween', 'contest', 'creativity'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'FUN'
  },
  {
    id: '19',
    title: 'Q3 Financial Transparency Report',
    description: 'Our quarterly breakdown of platform costs, revenue, and financial sustainability plans.',
    type: 'blog',
    contentUrl: '/reports/q3-financial',
    thumbnailUrl: '/logo.svg',
    author: 'Finance Team',
    date: generateContentDateForFilter('LAST MONTH', 25),
    tags: ['finance', 'transparency', 'sustainability'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'FACTUAL'
  },
  {
    id: '20',
    title: 'The Art of Productive Procrastination',
    description: 'How one member accidentally built three successful side projects while avoiding their main work.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example20',
    thumbnailUrl: '/character-mascot.png',
    author: 'Productivity Lab',
    date: generateContentDateForFilter('LAST MONTH', 12),
    duration: '28:30',
    tags: ['productivity', 'procrastination', 'projects'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'UNUSUAL'
  },
  {
    id: '21',
    title: 'How Do Online Friendships Really Work?',
    description: 'Investigating the psychology behind digital relationships and what makes them meaningful.',
    type: 'blog',
    contentUrl: '/content/online-friendships',
    thumbnailUrl: '/character-mascot.png',
    author: 'Social Science',
    date: generateContentDateForFilter('LAST MONTH', 8),
    tags: ['friendship', 'psychology', 'relationships'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'CURIOUS'
  },
  {
    id: '22',
    title: 'The Platform Monetization Controversy',
    description: 'Community divided over proposal to introduce premium membership tiers with exclusive features.',
    type: 'post',
    contentUrl: '/debates/monetization-controversy',
    thumbnailUrl: '/character-mascot.png',
    author: 'Policy Team',
    date: generateContentDateForFilter('LAST MONTH', 18),
    tags: ['monetization', 'premium', 'controversy'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'SPICY'
  },

  // Additional LAST MONTH content
  {
    id: '23',
    title: 'Pet Photo Friday: November Edition',
    description: 'The cutest pet photos shared by our community members during November.',
    type: 'post',
    contentUrl: '/content/pet-photos-november',
    thumbnailUrl: '/character-mascot.png',
    author: 'Pet Club',
    date: generateContentDateForFilter('LAST MONTH', 10),
    tags: ['pets', 'photos', 'community'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'NICE'
  },
  {
    id: '24',
    title: 'Debugging Stories That Will Make You Cry-Laugh',
    description: 'Community members share their most ridiculous debugging adventures and the lessons learned.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example24',
    thumbnailUrl: '/character-mascot.png',
    author: 'Debug Club',
    date: generateContentDateForFilter('LAST MONTH', 22),
    duration: '31:20',
    tags: ['debugging', 'stories', 'humor'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'FUN'
  },
  {
    id: '25',
    title: 'Platform Usage Analytics Dashboard',
    description: 'Interactive dashboard showing real-time community engagement metrics and usage patterns.',
    type: 'blog',
    contentUrl: '/analytics/usage-dashboard',
    thumbnailUrl: '/logo.svg',
    author: 'Data Team',
    date: generateContentDateForFilter('LAST MONTH', 5),
    tags: ['analytics', 'dashboard', 'usage'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'FACTUAL'
  },
  {
    id: '26',
    title: 'The Community Member Who Never Sleeps',
    description: 'Investigation into the mysterious member who seems to be active 24/7 across all timezones.',
    type: 'blog',
    contentUrl: '/content/never-sleeps-mystery',
    thumbnailUrl: '/character-mascot.png',
    author: 'Mystery Team',
    date: generateContentDateForFilter('LAST MONTH', 14),
    tags: ['mystery', 'investigation', 'community'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'UNUSUAL'
  },
  {
    id: '27',
    title: 'What Would Happen If We Banned All Notifications?',
    description: 'Thought experiment exploring how community behavior would change without notification systems.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example27',
    thumbnailUrl: '/character-mascot.png',
    author: 'Thought Lab',
    date: generateContentDateForFilter('LAST MONTH', 7),
    duration: '33:45',
    tags: ['notifications', 'experiment', 'behavior'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'CURIOUS'
  },
  {
    id: '28',
    title: 'Data Privacy vs Community Features',
    description: 'The heated debate over which privacy features to implement that might limit community functionality.',
    type: 'blog',
    contentUrl: '/debates/privacy-vs-features',
    thumbnailUrl: '/character-mascot.png',
    author: 'Privacy Team',
    date: generateContentDateForFilter('LAST MONTH', 11),
    tags: ['privacy', 'features', 'debate'],
    featured: false,
    timePeriod: 'LAST MONTH',
    perspective: 'SPICY'
  },

  // LAST YEAR CONTENT
  {
    id: '29',
    title: 'Year in Review: Our Funniest Moments',
    description: 'A compilation of the most hilarious community moments, inside jokes, and viral memes from this year.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example29',
    thumbnailUrl: '/character-mascot.png',
    author: 'Year Review Team',
    date: generateContentDateForFilter('LAST YEAR', 50),
    duration: '45:20',
    tags: ['year-review', 'humor', 'compilation'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'FUN'
  },
  {
    id: '30',
    title: 'Annual Community Report 2024',
    description: 'Comprehensive overview of community growth, achievements, challenges, and goals for the upcoming year.',
    type: 'blog',
    contentUrl: '/reports/annual-2024',
    thumbnailUrl: '/logo.svg',
    author: 'Leadership Team',
    date: generateContentDateForFilter('LAST YEAR', 100),
    tags: ['annual-report', 'community', 'achievements'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'FACTUAL'
  },
  {
    id: '31',
    title: 'The Great Server Migration Adventure',
    description: 'The wild story of how we moved our entire platform to new servers using carrier pigeons and hopes.',
    type: 'blog',
    contentUrl: '/content/server-migration-story',
    thumbnailUrl: '/character-mascot.png',
    author: 'DevOps Team',
    date: generateContentDateForFilter('LAST YEAR', 200),
    tags: ['migration', 'servers', 'adventure'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'UNUSUAL'
  },
  {
    id: '32',
    title: 'How Has Remote Community Building Evolved?',
    description: 'Reflecting on the changes in digital community dynamics over the past year.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example32',
    thumbnailUrl: '/character-mascot.png',
    author: 'Evolution Talk',
    date: generateContentDateForFilter('LAST YEAR', 150),
    duration: '52:15',
    tags: ['remote', 'evolution', 'community'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'CURIOUS'
  },
  {
    id: '33',
    title: 'The Moderation Crisis That Almost Broke Us',
    description: 'Honest retrospective on the controversial moderation decisions that split the community.',
    type: 'blog',
    contentUrl: '/content/moderation-crisis',
    thumbnailUrl: '/character-mascot.png',
    author: 'Crisis Team',
    date: generateContentDateForFilter('LAST YEAR', 300),
    tags: ['moderation', 'crisis', 'controversy'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'SPICY'
  },
  {
    id: '34',
    title: 'Community Support Success Stories',
    description: 'Heartwarming stories of how community members supported each other through difficult times.',
    type: 'post',
    contentUrl: '/content/support-stories',
    thumbnailUrl: '/character-mascot.png',
    author: 'Support Team',
    date: generateContentDateForFilter('LAST YEAR', 80),
    tags: ['support', 'success', 'community'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'NICE'
  },

  // Additional LAST YEAR content for complete coverage
  {
    id: '35',
    title: 'Epic April Fools Day Pranks Compilation',
    description: 'The most creative and harmless pranks our community pulled on each other this April.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example35',
    thumbnailUrl: '/character-mascot.png',
    author: 'Prank Squad',
    date: generateContentDateForFilter('LAST YEAR', 250),
    duration: '22:30',
    tags: ['pranks', 'april-fools', 'humor'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'FUN'
  },
  {
    id: '36',
    title: 'Platform Security Audit Results',
    description: 'Complete results from our third-party security audit and the improvements we have implemented.',
    type: 'blog',
    contentUrl: '/reports/security-audit',
    thumbnailUrl: '/logo.svg',
    author: 'Security Team',
    date: generateContentDateForFilter('LAST YEAR', 180),
    tags: ['security', 'audit', 'improvements'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'FACTUAL'
  },
  {
    id: '37',
    title: 'The Member Who Built Their House Like a Website',
    description: 'Architect applies web development principles to home design with surprisingly functional results.',
    type: 'blog',
    contentUrl: '/content/website-house',
    thumbnailUrl: '/character-mascot.png',
    author: 'Architecture Club',
    date: generateContentDateForFilter('LAST YEAR', 120),
    tags: ['architecture', 'web-dev', 'design'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'UNUSUAL'
  },
  {
    id: '38',
    title: 'Why Do We Form Digital Tribes?',
    description: 'Anthropological perspective on online community formation and digital belonging.',
    type: 'podcast',
    contentUrl: 'https://open.spotify.com/episode/example38',
    thumbnailUrl: '/character-mascot.png',
    author: 'Anthropology Corner',
    date: generateContentDateForFilter('LAST YEAR', 90),
    duration: '41:45',
    tags: ['anthropology', 'tribes', 'belonging'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'CURIOUS'
  },
  {
    id: '39',
    title: 'The Great Username Change Controversy',
    description: 'When we allowed username changes, chaos ensued. Here is what we learned.',
    type: 'post',
    contentUrl: '/content/username-controversy',
    thumbnailUrl: '/character-mascot.png',
    author: 'Policy Team',
    date: generateContentDateForFilter('LAST YEAR', 320),
    tags: ['usernames', 'policy', 'controversy'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'SPICY'
  },
  {
    id: '40',
    title: 'Birthday Surprise Coordination Champions',
    description: 'How our community secretly organized surprise celebrations for 50+ member birthdays.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example40',
    thumbnailUrl: '/character-mascot.png',
    author: 'Celebration Team',
    date: generateContentDateForFilter('LAST YEAR', 60),
    duration: '18:15',
    tags: ['birthdays', 'surprises', 'celebration'],
    featured: false,
    timePeriod: 'LAST YEAR',
    perspective: 'NICE'
  }
];

/**
 * Navigation items
 */
export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/content', label: 'Content Feed' }
];

/**
 * Admin navigation items
 */
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Subscribers', href: '/admin/subscribers', icon: '👥' },
  { label: 'Content', href: '/admin/content', icon: '📝' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' }
];

/**
 * API rate limiting configurations
 */
export const RATE_LIMITS = {
  EMAIL_SUBSCRIPTION: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  CONTACT_FORM: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000 // 1 hour
  },
  API_GENERAL: {
    maxAttempts: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
};

/**
 * Security configurations
 */
export const SECURITY_CONFIG = {
  ALLOWED_ORIGINS: [
      'https://kamunity.org',
  'https://www.kamunity.org',
  'https://app.kamunity.org'
  ],
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CSRF_TOKEN_LENGTH: 32,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

/**
 * Content moderation keywords (basic implementation)
 */
export const MODERATION_KEYWORDS = [
  // Add problematic keywords here
  // This is a basic implementation - use a proper content moderation service in production
]; 