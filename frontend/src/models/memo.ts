export interface MemoType {
    id?: String,
    name: String,
    description: String,
    date: String,
    location: {
        name: String,
        coordinates: [number, number]
    },
    media?: String[]
    tags?: String[]
}