const mongoose = require('mongoose')
async function InitDB() {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/db')
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
}

module.exports = {InitDB}