//const backendAPI = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/users`; // NOTE atlas
const backendAPI = `http://localhost:8080/api/users`; // NOTE local

import axios from "axios";
import { UserType } from "../models/user";

export class UserController {
  static async get_all() {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/`,
    });

    return response.data;
  }

  static async get_user_data(uid: string) {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/${uid}`,
    });

    return response.data;
  }

  static async create_user(user: UserType) {
    const response = await axios({
      method: "post",
      url: `${backendAPI}/`,
      data: user,
    });

    console.log(response.data);
    return response.data;
  }

  static async update_user(uid: string, user: UserType) {
    const response = await axios({
      method: "put",
      url: `${backendAPI}/${uid}`,
      data: user,
    });

    console.log(response.data);
    return response.data;
  }

  static async delete_user(uid: string) {
    const response = await axios({
      method: "delete",
      url: `${backendAPI}/${uid}`,
    });

    console.log(response);
    return response;
  }
}
