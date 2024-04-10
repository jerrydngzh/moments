const backendAPI = import.meta.env.VITE_BACKEND_API;

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
