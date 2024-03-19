const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

 async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get the username from the request parameters
      const { username } = req.query;

      // Create a new MongoDB client
      const client = new MongoClient(uri);

      try {
        // Access the database
        const db = client.db(dbName);

        // Access the users collection
        const usersCollection = db.collection('users');

        // Find the user document by username
        const user = await usersCollection.findOne({ username });

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get the memo IDs from the user document
        const memoIds = user.memos || [];

        // Access the memos collection
        const memosCollection = db.collection('memos');

        // Find all memos with IDs in the memoIds array
        const userMemos = await memosCollection.find({ _id: { $in: memoIds } }).toArray();

        res.status(200).json(userMemos);
      } finally {
        // Close the MongoDB client
        await client.close();
      }
    } catch (error) {
      console.error('Error fetching user memos:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
module.exports = handler;