const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

// Create a new MongoDB client
const client = new MongoClient(uri);

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Handler function for fetching users
async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Access the database
      const db = client.db(dbName);

      // Access the users collection
      const usersCollection = db.collection('users');

      // Fetch all users from the users collection
      const users = await usersCollection.find().toArray();

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}

module.exports = handler;
