import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Construct the path to the JSON file
      const filePath = path.join(process.cwd(), 'data/saveLoc.json');

      // Read the memo data from the JSON file
      const data = await fs.readFile(filePath, 'utf-8');
      const memos = JSON.parse(data);

      res.status(200).json(memos);
    } catch (error) {
      console.error('Error fetching memos:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
