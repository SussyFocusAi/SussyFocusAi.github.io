// pages/api/test.ts (at root level)
export default function handler(req, res) {
  res.status(200).json({ message: 'Test API works!' });
}