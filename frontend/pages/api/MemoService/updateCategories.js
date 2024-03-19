import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { action, username, locationName, memoIndex, categories } = req.body;

      if (action === 'updateUsernameCategories') {
        await updateUsernameCategories(username, categories);
        res.status(200).json({ success: true, message: 'Username categories updated successfully' });
      } else if (action === 'updateMemoCategories') {
        await updateMemoCategories(username, locationName, memoIndex, categories);
        res.status(200).json({ success: true, message: 'Memo categories updated successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid action' });
      }
    } catch (error) {
      console.error('Error updating categories:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

async function updateUsernameCategories(username, categories) {
  const filePath = path.join(process.cwd(), 'data/memos.json');
  let existingData = await readDataFromFile(filePath);

  if (!existingData[username]) {
    throw new Error('Username not found');
  }

  existingData[username].categories = categories;

  await writeDataToFile(filePath, existingData);
}

async function updateMemoCategories(username, locationName, memoIndex, categories) {
  const filePath = path.join(process.cwd(), 'data/memos.json');
  let existingData = await readDataFromFile(filePath);
    console.log(categories);
  if (!existingData[username]) {
    throw new Error('Username not found');
  }

  const locations = existingData[username].locations;

  if (!locations[locationName]) {
    throw new Error('Location not found');
  }

  const memos = locations[locationName].memo;
  if (memoIndex < 0 || memoIndex >= memos.length) {
    throw new Error('Invalid memo index');
  }

  memos[memoIndex].selectedCategories = categories;

  await writeDataToFile(filePath, existingData);
}

async function readDataFromFile(filePath) {
  let existingData = {};
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    existingData = JSON.parse(jsonData);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
  return existingData;
}

async function writeDataToFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
}
