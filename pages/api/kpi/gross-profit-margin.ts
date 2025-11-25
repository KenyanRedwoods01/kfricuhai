import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { start_date, end_date } = req.query;
    
    // This would normally proxy to Laravel backend
    // For now, returning mock data
    const result = {
      success: true,
      data: {
        gross_profit_margin: 25.5,
        period: {
          start_date: start_date || '2024-01-01',
          end_date: end_date || '2024-12-31'
        },
        interpretation: 'Good - Healthy profit margins'
      }
    };
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Gross Profit Margin API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}