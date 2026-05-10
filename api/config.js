// Vercel Serverless Function to provide public configuration
// Returns the Stripe public key and other client-side config

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

    if (!stripePublicKey) {
      console.error('STRIPE_PUBLIC_KEY environment variable is not configured');
      res.status(500).json({ error: 'Payment configuration error' });
      return;
    }

    res.status(200).json({
      stripePublicKey: stripePublicKey,
    });
  } catch (error) {
    console.error('Config endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
};
