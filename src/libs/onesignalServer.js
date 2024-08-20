import axios from 'axios';

const sendNotification = async (title, message, userIds) => {
  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { en: title },
      contents: { en: message },
      include_player_ids: userIds,
    }, {
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export default sendNotification;
