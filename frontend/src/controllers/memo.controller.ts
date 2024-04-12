const backendAPI = `${import.meta.env.VITE_BACKEND_API}/api/memos`;

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

  static async create_memo(uid: string, memo: MemoType, files: File[]): Promise<MemoType> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(file.name, file);
    });
    formData.append("memo", JSON.stringify(memo));

    const response = await axios({
      method: "post",
      url: `${backendAPI}/${uid}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
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
