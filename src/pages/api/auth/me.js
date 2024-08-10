import jwt from 'jsonwebtoken';

export default function meHandler(req, res) {
  const { myToken } = req.cookies;

  if (!myToken) {
    return res.status(401).json({ user: null });
  }

  try {
    const user = jwt.verify(myToken, 'secret');
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ user: null });
  }
}
