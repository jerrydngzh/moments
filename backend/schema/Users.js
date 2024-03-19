const UserSchema = {
    username: String,
    firstName: String,
    lastName: String,
    memos: [String],
    saveLoc: [{ type: String, coordinates: [Number] }], // Updated saveLoc schema
    tags: [String],
    email: String,
    password: String
};