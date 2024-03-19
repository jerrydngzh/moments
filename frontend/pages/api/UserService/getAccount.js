import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Construct the path to the JSON file
      const filePath = path.join(process.cwd(), 'data/demouserData.json');

      // Read the memo data from the JSON file
      const data = await fs.readFile(filePath, 'utf-8');
      const users = JSON.parse(data);
      console.log(users);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching memos:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
