import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.query;
  
  if (!params || !Array.isArray(params) || params.length < 2) {
    res.status(400).send('Bad Request');
    return;
  }

  const [width, height] = params;
  const w = parseInt(width as string) || 400;
  const h = parseInt(height as string) || 300;

  // Create a character mascot SVG
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <!-- Background gradient -->
      <defs>
        <radialGradient id="bg" cx="50%" cy="30%" r="70%">
          <stop offset="0%" style="stop-color:#E0E7FF;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#C7D2FE;stop-opacity:1" />
        </radialGradient>
        <linearGradient id="hair" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#D97706;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="suit" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="500" fill="url(#bg)"/>
      
      <!-- Character Body -->
      <!-- Suit Body -->
      <ellipse cx="200" cy="400" rx="80" ry="90" fill="url(#suit)"/>
      
      <!-- Shirt -->
      <ellipse cx="200" cy="380" rx="60" ry="70" fill="#FFFFFF"/>
      
      <!-- Tie -->
      <rect x="190" y="340" width="20" height="80" fill="#4F46E5" rx="2"/>
      
      <!-- Head -->
      <circle cx="200" cy="250" r="80" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3"/>
      
      <!-- Hair -->
      <path d="M 140 220 Q 200 180 260 220 Q 250 200 240 190 Q 220 185 200 185 Q 180 185 160 190 Q 150 200 140 220" fill="url(#hair)"/>
      
      <!-- Glasses Frame -->
      <circle cx="175" cy="240" r="25" fill="none" stroke="#1F2937" stroke-width="4"/>
      <circle cx="225" cy="240" r="25" fill="none" stroke="#1F2937" stroke-width="4"/>
      <line x1="200" y1="240" x2="200" y2="240" stroke="#1F2937" stroke-width="4"/>
      
      <!-- Glasses Lenses -->
      <circle cx="175" cy="240" r="20" fill="#E0F2FE" opacity="0.7"/>
      <circle cx="225" cy="240" r="20" fill="#E0F2FE" opacity="0.7"/>
      
      <!-- Eyes -->
      <circle cx="175" cy="240" r="8" fill="#1F2937"/>
      <circle cx="225" cy="240" r="8" fill="#1F2937"/>
      <circle cx="177" cy="238" r="2" fill="#FFFFFF"/>
      <circle cx="227" cy="238" r="2" fill="#FFFFFF"/>
      
      <!-- Nose -->
      <ellipse cx="200" cy="260" rx="4" ry="6" fill="#F59E0B"/>
      
      <!-- Mouth (Smile) -->
      <path d="M 180 280 Q 200 295 220 280" stroke="#1F2937" stroke-width="3" fill="none" stroke-linecap="round"/>
      
      <!-- Arms -->
      <ellipse cx="130" cy="350" rx="25" ry="50" fill="url(#suit)" transform="rotate(-20 130 350)"/>
      <ellipse cx="270" cy="350" rx="25" ry="50" fill="url(#suit)" transform="rotate(20 270 350)"/>
      
      <!-- Hands -->
      <circle cx="110" cy="380" r="15" fill="#FEF3C7"/>
      <circle cx="290" cy="380" r="15" fill="#FEF3C7"/>
      
      <!-- Thumbs up gesture -->
      <rect x="105" y="365" width="6" height="15" fill="#FEF3C7" rx="3"/>
      
      <!-- Text -->
      <text x="200" y="480" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#4338CA">
        Kamunity Mascot
      </text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(svg);
} 