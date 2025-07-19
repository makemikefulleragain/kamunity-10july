import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  body?: string;
  type: string;
  perspective: string[];
  timePeriod: string;
  featured: boolean;
  thumbnailUrl?: string;
  contentUrl: string;
  author: string;
  date: string;
  duration?: string;
  tags: string[];
  logoCard?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const contentDir = path.join(process.cwd(), 'content/media');
    
    // Check if directory exists, if not return empty array
    if (!fs.existsSync(contentDir)) {
      return res.status(200).json([]);
    }

    const fileNames = fs.readdirSync(contentDir);
    const mdFiles = fileNames.filter(name => name.endsWith('.md'));

    const content: ContentItem[] = [];

    for (const fileName of mdFiles) {
      try {
        const filePath = path.join(contentDir, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content: body } = matter(fileContents);

        // Validate required fields
        if (!data.title || !data.description || !data.type || !data.contentUrl) {
          console.warn(`Skipping invalid content file: ${fileName} - missing required fields`);
          continue;
        }

        // Extract ID from filename
        const id = fileName.replace(/\.md$/, '');

        // Ensure perspective is array
        const perspective = Array.isArray(data.perspective) 
          ? data.perspective 
          : data.perspective 
            ? [data.perspective] 
            : ['FACTUAL'];

        const item: ContentItem = {
          id,
          title: data.title,
          description: data.description,
          body: body || '',
          type: data.type,
          perspective,
          timePeriod: data.timePeriod || 'TODAY',
          featured: Boolean(data.featured),
          thumbnailUrl: data.thumbnailUrl,
          contentUrl: data.contentUrl,
          author: data.author || 'Kamunity Team',
          date: data.date,
          duration: data.duration,
          tags: Array.isArray(data.tags) ? data.tags : [],
          logoCard: Boolean(data.logoCard)
        };

        content.push(item);
      } catch (error) {
        console.error(`Error processing file ${fileName}:`, error);
        continue;
      }
    }

    // Apply filters
    let filteredContent = content;

    // Filter by query parameters
    const { featured, perspective, type, timePeriod, id } = req.query;

    if (id) {
      filteredContent = filteredContent.filter(item => item.id === id);
    }

    if (featured === 'true') {
      filteredContent = filteredContent.filter(item => item.featured);
    }

    if (perspective && perspective !== 'all') {
      filteredContent = filteredContent.filter(item => 
        item.perspective.includes(perspective as string)
      );
    }

    if (type && type !== 'all') {
      filteredContent = filteredContent.filter(item => item.type === type);
    }

    if (timePeriod && timePeriod !== 'all') {
      filteredContent = filteredContent.filter(item => item.timePeriod === timePeriod);
    }

    // Sort by date (newest first)
    filteredContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Set cache headers for faster updates in development
    const cacheTime = process.env.NODE_ENV === 'development' ? 0 : 300; // 5 minutes in production
    res.setHeader('Cache-Control', `public, s-maxage=${cacheTime}, stale-while-revalidate=600`);

    res.status(200).json(filteredContent);
  } catch (error) {
    console.error('Error reading content:', error);
    res.status(500).json({ message: 'Error reading content' });
  }
} 