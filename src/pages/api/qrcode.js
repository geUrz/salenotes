import QRCode from 'qrcode';

export default async function handler(req, res) {
  const { text } = req.query;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(text);
    res.status(200).json({ qrCodeDataUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}