import type { NextApiRequest, NextApiResponse } from 'next';
import { healthCheck } from '@/lib/monitoring';

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>
) {
  // Set cache headers for health checks
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Content-Type', 'application/json');

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }

  try {
    const healthStatus = await healthCheck();
    
    const response: HealthCheckResponse = {
      ...healthStatus,
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Set appropriate HTTP status code based on health
    const statusCode = healthStatus.status === 'healthy' ? 200 : 
                      healthStatus.status === 'degraded' ? 206 : 503;

    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Health check error:', error);
    
    const response: HealthCheckResponse = {
      status: 'unhealthy',
      services: {},
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    res.status(503).json(response);
  }
} 