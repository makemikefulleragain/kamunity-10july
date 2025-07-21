import { NextApiRequest, NextApiResponse } from 'next';

interface ReactionData {
  reactions: {
    [contentId: string]: {
      [reactionType: string]: number;
    };
  };
}

// SERVERLESS-COMPATIBLE: Use static initial counts (can be updated later with database)
function getInitialReactions(): ReactionData {
  return {
    reactions: {
      // Sample initial counts for demo content
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get reactions for a specific content ID or all reactions
        const { contentId } = req.query;
        const allReactions = getInitialReactions();
        
        if (contentId && typeof contentId === 'string') {
          const contentReactions = allReactions.reactions[contentId] || {};
          res.status(200).json({ reactions: contentReactions });
        } else {
          res.status(200).json(allReactions);
        }
        break;

      case 'POST':
        // SERVERLESS-COMPATIBLE: Simulate reaction increment (client handles persistence)
        const { contentId: postContentId, reactionType } = req.body;
        
        if (!postContentId || !reactionType) {
          return res.status(400).json({ error: 'contentId and reactionType are required' });
        }

        // Get current reactions and simulate increment
        const data = getInitialReactions();
        
        // Initialize content reactions if not exists
        if (!data.reactions[postContentId]) {
          data.reactions[postContentId] = {};
        }
        
        // Simulate increment (client will handle actual persistence via localStorage)
        const currentCount = data.reactions[postContentId][reactionType] || 0;
        data.reactions[postContentId][reactionType] = currentCount + 1;
        
        res.status(200).json({ 
          success: true,
          reactions: data.reactions[postContentId],
          message: 'Reaction recorded (demo mode)'
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