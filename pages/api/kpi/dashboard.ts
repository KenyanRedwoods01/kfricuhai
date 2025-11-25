import type { NextApiRequest, NextApiResponse } from 'next';
import { getKpiDashboard } from '../../../lib/api/kpi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { period } = req.query;
    
    const result = await getKpiDashboard(period as string);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: result.error || 'Failed to fetch KPI dashboard data' });
    }
  } catch (error) {
    console.error('KPI Dashboard API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}