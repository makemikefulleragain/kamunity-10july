import { TimelineNode, MediaContent } from '@/types';

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
  {
    id: '1',
    title: 'Welcome to Kamunity',
    description: 'Discover how our community-first approach is changing the way people connect and collaborate.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/kamunity-logo.png',
    author: 'Kamunity Team',
    date: '2024-01-15',
    tags: ['community', 'introduction', 'welcome'],
    featured: true,
    timePeriod: 'TODAY',
    perspective: 'NICE'
  },
  {
    id: '2',
    title: 'Building Connected Communities',
    description: 'Learn about the principles that guide our mission to create meaningful connections between people.',
    type: 'blog',
    contentUrl: '/content/building-communities',
    thumbnailUrl: '/og-image.png',
    author: 'Community Team',
    date: '2024-01-20',
    tags: ['community', 'connection', 'principles'],
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
    date: '2024-01-25',
    duration: '35:20',
    tags: ['technology', 'future', 'digital'],
    featured: true,
    timePeriod: 'TODAY',
    perspective: 'CURIOUS'
  },
  {
    id: '4',
    title: 'Community Success Stories',
    description: 'Real stories from real people about how Kamunity has impacted their lives.',
    type: 'video',
    contentUrl: 'https://www.youtube.com/watch?v=example2',
    thumbnailUrl: '/kamunity-logo.png',
    author: 'Success Team',
    date: '2024-02-01',
    tags: ['success', 'stories', 'impact'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FUN'
  },
  {
    id: '5',
    title: 'Getting Started Guide',
    description: 'Everything you need to know to make the most of your Kamunity experience.',
    type: 'blog',
    contentUrl: '/content/getting-started',
    thumbnailUrl: '/logo.svg',
    author: 'Help Team',
    date: '2024-02-05',
    tags: ['guide', 'getting-started', 'help'],
    featured: false,
    timePeriod: 'LAST WEEK',
    perspective: 'FACTUAL'
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
    'https://kamunity.ai',
    'https://www.kamunity.ai',
    'https://app.kamunity.ai'
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