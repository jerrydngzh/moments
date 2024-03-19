import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the location and memo from the request body
      const { username, locationName, location } = req.body;
      console.log(req.body);
      const newSave = {
        locationName,
        location,
      };
      
      // Construct the path to the JSON file
      const filePath = path.join(process.cwd(), 'data/memos.json');

      // Read the existing JSON file or initialize with an empty object
      let existingData = {};
      try {
        const jsonData = await fs.readFile(filePath, 'utf-8');
        existingData = JSON.parse(jsonData);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      if (!existingData[username]) {
        existingData[username] = {};
      }

      if(!existingData[username].saveLoc){
        existingData[username].saveLoc = [];
      }

      existingData[username].saveLoc.push(newSave);

      console.log(existingData);

      // Write the updated data back to the JSON file
      await fs.writeFile(filePath, JSON.stringify(existingData), 'utf-8');

      res.status(200).json({ success: true, message: 'Memo created successfully' });
    } catch (error) {
      console.error('Error creating memo:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
