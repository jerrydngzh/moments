const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

 async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Get the username, locationName, and location from the request body
      const { username, locationName, location } = req.body;

      // Create a new MongoDB client
      const client = new MongoClient(uri);

      try {

        // Access the database
        const db = client.db(dbName);

        // Access the users collection
        const usersCollection = db.collection('users');

        // Check if the user exists
        const existingUser = await usersCollection.findOne({ username });

        if (!existingUser) {
          return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Update the user document to include the new saved location
        await usersCollection.updateOne(
          { username },
          { $push: { 'saveLoc': { locationName, coordinates: location } } }
        );

        res.status(200).json({ success: true, message: 'Location saved successfully' });
      } finally {
        // Close the MongoDB client
        await client.close();
      }
    } catch (error) {
      console.error('Error saving location:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
module.exports = handler;