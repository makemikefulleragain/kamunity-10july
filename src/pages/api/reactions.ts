import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ReactionData {
  reactions: {
    [contentId: string]: {
      [reactionType: string]: number;
    };
  };
}

const REACTIONS_FILE = path.join(process.cwd(), 'data', 'reactions.json');

// Initialize reactions file if it doesn't exist
function initializeReactionsFile() {
  if (!fs.existsSync(REACTIONS_FILE)) {
    const initialData: ReactionData = { reactions: {} };
    fs.writeFileSync(REACTIONS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read reactions from file
function readReactions(): ReactionData {
  initializeReactionsFile();
  try {
    const data = fs.readFileSync(REACTIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reactions file:', error);
    return { reactions: {} };
  }
}

// Write reactions to file
function writeReactions(data: ReactionData) {
  try {
    fs.writeFileSync(REACTIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing reactions file:', error);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get reactions for a specific content ID or all reactions
        const { contentId } = req.query;
        const allReactions = readReactions();
        
        if (contentId && typeof contentId === 'string') {
          const contentReactions = allReactions.reactions[contentId] || {};
          res.status(200).json({ reactions: contentReactions });
        } else {
          res.status(200).json(allReactions);
        }
        break;

      case 'POST':
        // Add or increment a reaction
        const { contentId: postContentId, reactionType } = req.body;
        
        if (!postContentId || !reactionType) {
          return res.status(400).json({ error: 'contentId and reactionType are required' });
        }

        const data = readReactions();
        
        // Initialize content reactions if not exists
        if (!data.reactions[postContentId]) {
          data.reactions[postContentId] = {};
        }
        
        // Initialize or increment reaction count
        if (!data.reactions[postContentId][reactionType]) {
          data.reactions[postContentId][reactionType] = 0;
        }
        data.reactions[postContentId][reactionType] += 1;
        
        writeReactions(data);
        
        res.status(200).json({ 
          success: true,
          reactions: data.reactions[postContentId]
        });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 