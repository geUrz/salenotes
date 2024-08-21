// pages/api/testNotification.js
import sendNotification from '@/lib/onesignalServer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await sendNotification('Test Title', 'This is a test message');
      res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
