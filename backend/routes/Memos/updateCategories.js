const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

 async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { action, username, categories } = req.body;

      if (action === 'updateUsernameCategories') {
        await updateUsernameCategories(username, categories);
        res.status(200).json({ success: true, message: 'Username categories updated successfully' });
      } else if (action === 'updateMemoCategories') {
        await updateMemoCategories(username, categories);
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
  const client = new MongoClient(uri);
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const result = await usersCollection.updateOne(
      { username },
      { $set: { tags: categories } }
    );
    if (result.matchedCount === 0) {
      throw new Error('Username not found');
    }
  } finally {
    await client.close();
  }
}

async function updateMemoCategories(username, categories) {
  const client = new MongoClient(uri);
  try {
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    const memosCollection = db.collection('memos');
    const user = await usersCollection.findOne({ username });
    if (!user) {
      throw new Error('Username not found');
    }

    // Iterate over each memo ID in the user's document
    for (const memoId of user.memos) {
      // Find the corresponding memo in the memos collection
      const memo = await memosCollection.findOne({ _id: memoId });
      if (!memo) {
        throw new Error(`Memo with ID ${memoId} not found`);
      }

      // Update the tags of the memo
      memo.tags = categories;

      // Update the memo in the memos collection
      await memosCollection.updateOne(
        { _id: memoId },
        { $set: { tags: categories } }
      );
    }

    // Update the tags for all memos in the user's document
    await usersCollection.updateOne(
      { username },
      { $set: { 'memos.$[].tags': categories } }
    );

    return true;
  } finally {
    await client.close();
  }
}
module.exports = handler;