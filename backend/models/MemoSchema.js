const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
})

const memoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: locationSchema,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    user_id: {
        type: String,
        required: true
    },

    // NOTE: Iteration 2
    media: {
        type: [String],
        default: []
    },
    tags: {
        type: [String],
        default: []
    }
})
const Memo = mongoose.model('Memo', memoSchema)
module.exports = Memo