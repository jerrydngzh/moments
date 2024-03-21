export interface MemoType {
    id?: String,
    name: String,
    description: String,
    date: String,
    location: {
        name: String,
        lat: Number,
        lon: Number
    },
    media?: String[]
    tags?: String[]
}