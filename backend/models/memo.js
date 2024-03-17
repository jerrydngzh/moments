import mongoose from 'mongoose'
const { Schema, model } = mongoose

const memoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }, 
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ""
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    user_id: {
        type: String,
        required: true
    }
})

const Memo = model('Memo', memoSchema)
export default Memo