// pages/api/createAccount.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the location and memo from the request body
      const { username, email, password } = req.body;

      const newUser = {
        [username]: {
          email,
          password,
        },
      };

      // Construct the path to the JSON file
      const filePath = path.join(process.cwd(), 'data/demouserData.json');

      // Check if the file exists
      const fileExists = await fs.access(filePath)
        .then(() => true)
        .catch(() => false);

      // Read the existing JSON file or initialize with an empty object
      const existingData = fileExists
        ? await fs.readFile(filePath, 'utf-8').then(JSON.parse)
        : {};

      // Check if the username already exists
      if (existingData[username]) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }

      // Add the new user to the object
      existingData[username] = {
        email,
        password,
      };

      // Write the updated data back to the JSON file
      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf-8');

      res.status(200).json({ success: true, message: 'Account created successfully' });
    } catch (error) {
      console.error('Error creating account:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
