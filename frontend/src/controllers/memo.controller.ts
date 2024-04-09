//const backendAPI = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/memos`; // NOTE atlas
const backendAPI = `http://localhost:8080/api/memos`; // NOTE local

import { MemoType } from '../models/memo';
import axios from 'axios';

export class MemoController {
  static async get_all_memos(user_id: string): Promise<MemoType[]> {
    console.log("get_all_memos user:", user_id)
    const result = await axios.get(`${backendAPI}/${user_id}`);
    return result.data;
  }

  static async get_memo(user_id: string, memo_id: string) {
    const result = await axios.get(`${backendAPI}/${user_id}/${memo_id}`);
    return result.data;
  }

  static async create_memo(user_id: string, memo: MemoType) {
    // const result = await axios.post(`${backendAPI}/${user_id}`, memo);

    console.log(memo);

    const response = await axios({
      method: "post",
      url: `${backendAPI}/${user_id}`,
      data: memo,
    });

    console.log(response.data);

    return response.data;
  }

  static async update_memo(user_id: string, memo: MemoType) {
    const result = await axios.put(`${backendAPI}/${user_id}/${memo.id}`, memo);
    return result.data;
  }

  static async delete_memo(user_id: string, memo_id: string) {
    const result = await axios.delete(`${backendAPI}/${user_id}/${memo_id}`);
    return result.data;
  }
}
