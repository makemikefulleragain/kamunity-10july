import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface ContentItem {
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

function convertToCSV(content: ContentItem[]): string {
  if (content.length === 0) {
    return 'No content available for export';
  }

  const headers = [
    'ID', 'Title', 'Description', 'Body Content', 'Type', 'Perspective',
    'Time Period', 'Featured', 'Thumbnail URL', 'Content URL', 'Author',
    'Date', 'Duration', 'Tags', 'Logo Card'
  ];

  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = content.map(item => [
    escapeCSV(item.id),
    escapeCSV(item.title),
    escapeCSV(item.description),
    escapeCSV(item.body?.replace(/\n/g, ' ').replace(/\r/g, ' ') || ''),
    escapeCSV(item.type),
    escapeCSV(Array.isArray(item.perspective) ? item.perspective.join('; ') : item.perspective),
    escapeCSV(item.timePeriod),
    escapeCSV(item.featured ? 'Yes' : 'No'),
    escapeCSV(item.thumbnailUrl || ''),
    escapeCSV(item.contentUrl),
    escapeCSV(item.author),
    escapeCSV(item.date),
    escapeCSV(item.duration || ''),
    escapeCSV(Array.isArray(item.tags) ? item.tags.join('; ') : ''),
    escapeCSV(item.logoCard ? 'Yes' : 'No')
  ]);

  return [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
}

  function isAuthorizedAdmin(req: NextApiRequest): boolean {
    if (process.env.NODE_ENV === 'development') return true;
    const authHeader = req.headers.authorization;
    return Boolean(authHeader && authHeader.startsWith('Bearer '));
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isAuthorizedAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized - Admin access required' });
  }

  try {
    const contentDir = path.join(process.cwd(), 'content/media');
    
    if (!fs.existsSync(contentDir)) {
      return res.status(200)
        .setHeader('Content-Type', 'text/csv')
        .setHeader('Content-Disposition', 'attachment; filename="kamunity-content-export.csv"')
        .send('No content directory found');
    }

    const fileNames = fs.readdirSync(contentDir);
    const mdFiles = fileNames.filter(name => name.endsWith('.md'));
    const content: ContentItem[] = [];

    for (const fileName of mdFiles) {
      try {
        const filePath = path.join(contentDir, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content: body } = matter(fileContents);

        if (!data.title || !data.description || !data.type || !data.contentUrl) {
          console.warn(`Skipping invalid content file: ${fileName}`);
          continue;
        }

        const id = fileName.replace(/\\.md$/, '');
        const perspective = Array.isArray(data.perspective) 
          ? data.perspective 
          : data.perspective ? [data.perspective] : ['FACTUAL'];

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

    content.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const csvContent = convertToCSV(content);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `kamunity-content-export-${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.write('\\ufeff');
    res.write(csvContent);
    res.end();

      } catch (error) {
      console.error('Error exporting content:', error);
      res.status(500).json({ 
        message: 'Error exporting content',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : 'Internal server error'
      });
    }
}