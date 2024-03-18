import mongoose from 'mongoose'
const { Schema, model } = mongoose

const memoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String, // NOTE: location object 
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

const Memo = model('Memo', memoSchema)
export default Memo