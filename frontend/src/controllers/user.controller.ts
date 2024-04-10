// const backendAPI = https://moments-backend-6qo6tf2l7q-uw.a.run.app/api/users // NOTE Cloud Run
const backendAPI = `http://localhost:8080/api/users`; // NOTE local

import axios from "axios";
import { UserType } from "../models/user";

export class UserController {
  static async get_all(): Promise<UserType[]> {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/`,
    });

    return response.data;
  }

  static async get_user_data(uid: string): Promise<UserType> {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/${uid}`,
    });

    return response.data;
  }

  static async create_user(user: UserType): Promise<UserType> {
    const response = await axios({
      method: "post",
      url: `${backendAPI}/`,
      data: user,
    });

    return response.data;
  }

  static async update_user(uid: string, user: UserType): Promise<UserType> {
    const response = await axios({
      method: "put",
      url: `${backendAPI}/${uid}`,
      data: user,
    });

    return response.data;
  }

  static async delete_user(uid: string): Promise<UserType> {
    const response = await axios({
      method: "delete",
      url: `${backendAPI}/${uid}`,
    });

    return response.data;
  }
}
