import mongoose from 'mongoose'
import Location from './location'
const { Schema, model } = mongoose

const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
})

const memoSchema = new Schema({
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
        type: mongoose.Schema.Types.ObjectId,
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