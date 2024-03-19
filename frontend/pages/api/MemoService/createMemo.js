import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the location and memo from the request body
      const { username, location, locationName, memo, selectedCategories } = req.body;
      console.log(req.body);

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

      if (!existingData[username].categories) {
        existingData[username].categories = [];
      }

      // Add new categories if they don't exist
      selectedCategories.forEach(category => {
        if (!existingData[username].categories.includes(category)) {
          existingData[username].categories.push(category);
        }
      });
      if(!existingData[username].locations){
        existingData[username].locations = {}
      }
      if (!existingData[username].locations[locationName]) {

        existingData[username].locations[locationName] = { "coordinates": location, "memo": [{ memo, selectedCategories }] };
      } else {
        existingData[username].locations[locationName].memo.push({ memo, selectedCategories });
      }

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
