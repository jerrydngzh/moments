//const backendAPI = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/memos`; // NOTE atlas
const backendAPI = `http://localhost:8080/api/memos`; // NOTE local

import { MemoType } from "../models/memo";
import axios from "axios";

export class MemoController {
  static async get_all(): Promise<MemoType[]> {
    const result = await axios.get(`${backendAPI}/`);
    return result.data;
  }

  static async get_all_memos(uid: string): Promise<MemoType[]> {
    const result = await axios.get(`${backendAPI}/${uid}`);
    return result.data;
  }

  static async get_memo(uid: string, mid: string): Promise<MemoType> {
    const result = await axios.get(`${backendAPI}/${uid}/${mid}`);
    return result.data;
  }

  static async create_memo(uid: string, memo: MemoType): Promise<MemoType> {
    const response = await axios({
      method: "post",
      url: `${backendAPI}/${uid}`,
      data: memo,
    });

    return response.data;
  }

  static async update_memo(uid: string, memo: MemoType): Promise<MemoType> {
    const result = await axios.put(`${backendAPI}/${uid}/${memo._id}`, memo);
    return result.data;
  }

  static async delete_memo(uid: string, mid: string): Promise<string> {
    const result = await axios.delete(`${backendAPI}/${uid}/${mid}`);
    return result.data;
  }
}
