const MemoSchema = {
    name: String,
    date: { type: Number, required: true },
    location: {
        locationTitle: String,
        coordinates: [Number]
    },
    description: String,
    userId: String,
    media: [String],
    tags: [String]
};
