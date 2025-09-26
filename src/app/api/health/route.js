import { db } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection and get stats
    const stats = await db.healthCheck();
    
    return Response.json({
      status: 'healthy',
      database: 'connected',
      provider: 'supabase',
      timestamp: new Date().toISOString(),
      stats: {
        users: stats.userCount
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return Response.json({
      status: 'unhealthy',
      database: 'disconnected',
      provider: 'supabase',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
