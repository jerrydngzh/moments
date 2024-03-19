const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'Moments'; // Replace 'yourDatabaseName' with your actual database name

 async function handler(req, res) {
    if (req.method === 'POST') {
        try {
        // Get the username, email, and password from the request body
        const { firstName, lastName, username, email, password } = req.body;

        // Create a new MongoDB client
        const client = new MongoClient(uri);

        try {

            // Access the database
            const db = client.db(dbName);

            // Access the users collection
            const usersCollection = db.collection('users');

            // Check if the username already exists
            const existingUser = await usersCollection.findOne({ username });

            if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
            }

            // Insert the new user into the users collection
            const result = await usersCollection.insertOne({
                firstName,
                lastName,
                username,
                email,
                password,
                memos: [] ,// Initialize memos as an empty array for the new user
                saveLoc: []
            });

            console.log('User inserted:', result.insertedId);

            res.status(200).json({ success: true, message: 'Account created successfully' });
        } finally {
            // Close the MongoDB client
            await client.close();
        }
        } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
    }
    module.exports = handler;