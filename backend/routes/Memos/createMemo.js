const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

 async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Destructure the required fields from the request body
      const { name, date, location, description, userId, media, tags } = req.body;

      // Create a new MongoDB client
      const client = new MongoClient(uri);

      try {
        // Access the database
        const db = client.db(dbName);

        // Access the memos collection
        const memosCollection = db.collection('memos');

        // Insert the new memo into the memos collection
        const result = await memosCollection.insertOne({
          name,
          date,
          location,
          description,
          userId,
          media,
          tags
        });

        console.log('Memo inserted:', result.insertedId);

        // Access the users collection
        const usersCollection = db.collection('users');

        // Update the user document to include a reference to the newly created memo
        await usersCollection.updateOne(
          { username: userId }, // Assuming 'username' is used as the identifier for users
          { $push: { memos: result.insertedId.toString() } }
        );

        res.status(200).json({ success: true, message: 'Memo created successfully' });
      } finally {
        // Close the MongoDB client
        await client.close();
      }
    } catch (error) {
      console.error('Error creating memo:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
module.exports = handler;