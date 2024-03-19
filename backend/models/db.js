const mongoose = require('mongoose');
import { Memo } from './MemoSchema';

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const memoHelpers = {
    get_all_memos: async function () {
        return await Memo.find();
    },

    get_memo_by_id: async function (id) {
        return await Memo.findById(id);
    },

    create_memo: async function (memo) {
        return await new Memo(memo).save();
    },

    update_memo: async function (id, memo) {
        return await Memo.findByIdAndUpdate(id, memo, { new: true });
    },

    delete_memo: async function (id) {
        return await Memo.findByIdAndDelete(id);
    }
};


module.exports = { memoHelpers };