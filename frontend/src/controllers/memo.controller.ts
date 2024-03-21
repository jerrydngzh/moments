const backendAPI = `http://localhost:3000/api/memos`; // NOTE
import { MemoType } from '../models/memo';
import axios from 'axios';

export class MemoController {
    static async get_all_memos(user_id: String) {
        try {
            const result = await axios.get(`${backendAPI}/${user_id}`)
            return result.data
        } catch (e: any) {
            console.error(e)

            if (e.status === 404) {
                return []
            }
            return null
        }
    }

    static async get_memo(user_id: String, memo_id: String) {
        try {
            const result = await axios.get(`${backendAPI}/${user_id}/${memo_id}`)
            return result.data
        } catch (e: any) {
            console.error(e)
            
            if (e.status == 404) {
                return []
            }

            return null
        }
    }

    static async create_memo(user_id: String, memo: MemoType) {
        // return axios.post(`${backendAPI}/${user_id}`, memo)
        //     .then((response) => response)
        //     .catch((error) => {
        //         console.error('Error:', error)
        //     })

        try {
            const result = await axios.post(`${backendAPI}/${user_id}`, memo)
            return result.data
        } catch (e: any) {
            console.error(e)
            if (e.response.status === 404) {
                return []
            }
            return null
        }
    }

    static async update_memo(user_id: String, memo: MemoType) {
        try {
            const result = await axios.put(`${backendAPI}/${user_id}/${memo.id}`, memo)
            return result.data
        } catch (e: any) {
            console.error(e)
            return null
        }
    }

    static async delete_memo(user_id: String, memo_id: String) {
        try {
            const result = await axios.delete(`${backendAPI}/${user_id}/${memo_id}`)
            return result.data
        } catch (e: any) {
            console.error(e)
            return null
        }
    }
}