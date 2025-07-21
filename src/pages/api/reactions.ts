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

// Read actual reactions from the reactions.json file
function getActualReactions(): ReactionData {
  try {
    const reactionsPath = path.join(process.cwd(), 'data', 'reactions.json');
    if (fs.existsSync(reactionsPath)) {
      const reactionsContent = fs.readFileSync(reactionsPath, 'utf8');
      return JSON.parse(reactionsContent);
    }
  } catch (error) {
    console.error('Error reading reactions.json:', error);
  }
  
  // Fallback if file doesn't exist
  return {
    reactions: {
      "sample-content-1": {
        "FUN": 12,
        "FACTUAL": 8,
        "SPICY": 3,
        "NICE": 15,
        "UNUSUAL": 5,
        "CURIOUS": 7
      },
      "sample-content-2": {
        "FUN": 6,
        "FACTUAL": 12,
        "SPICY": 9,
        "NICE": 4,
        "UNUSUAL": 11,
        "CURIOUS": 8
      }
    }
  };
}

// Save reactions back to the file (for demo purposes - in production use database)
function saveReactions(reactionData: ReactionData): boolean {
  try {
    const reactionsPath = path.join(process.cwd(), 'data', 'reactions.json');
    fs.writeFileSync(reactionsPath, JSON.stringify(reactionData, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving reactions.json:', error);
    return false;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get reactions for a specific content ID or all reactions
        const { contentId } = req.query;
        const allReactions = getActualReactions();
        
        if (contentId && typeof contentId === 'string') {
          const contentReactions = allReactions.reactions[contentId] || {};
          res.status(200).json({ reactions: contentReactions });
        } else {
          res.status(200).json(allReactions);
        }
        break;

      case 'POST':
        // Record actual reaction increment and save to file
        const { contentId: postContentId, reactionType } = req.body;
        
        if (!postContentId || !reactionType) {
          return res.status(400).json({ error: 'contentId and reactionType are required' });
        }

        // Get current reactions from file
        const data = getActualReactions();
        
        // Initialize content reactions if not exists
        if (!data.reactions[postContentId]) {
          data.reactions[postContentId] = {};
        }
        
        // Increment the reaction count
        const currentCount = data.reactions[postContentId][reactionType] || 0;
        data.reactions[postContentId][reactionType] = currentCount + 1;
        
        // Save back to file
        const saved = saveReactions(data);
        
        res.status(200).json({ 
          success: saved,
          reactions: data.reactions[postContentId],
          message: saved ? 'Reaction recorded successfully' : 'Reaction recorded (memory only)'
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