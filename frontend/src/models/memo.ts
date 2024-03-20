export interface Memo {
    id?: String,
    name: String,
    description: String,
    date: Date,
    location: {
        name: String,
        lat: Number,
        lon: Number
    },
    media: Array<String>
    tags: Array<String>
}