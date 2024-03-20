const backendAPI = `http://localhost:3000/api/memos`;
import { Memo } from '../models/memo';
import axios from 'axios';

class MemoController {

    async get_all_memo(user_id: String) {}

    async get_memo(user_id: String, memo_id: String) {}

    async update_memo(user_id: String, memo: Memo) {}

    async create_memo(user_id: String, memo: Memo) {}

    async delete_memo(user_id: String, memo_id: String) {}
}