const url = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/users`;
import { UserType } from "../models/user";
import axios from "axios";

export class UserController {
  // TODO: Change how errors are handled in frontend, currently just logs error

  static async get_all() {
    try {
      const response = await axios({
        method: "get",
        url: `${url}/`,
      });

      console.log(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async get_user_profile(user_id: String) {
    try {
      const response = await axios({
        method: "get",
        url: `${url}/${user_id}`,
      });

      console.log(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async create_user(user: UserType) {
    try {
      const response = await axios({
        method: "post",
        url: `${url}/`,
        data: user,
      });

      console.log(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async update_user(user_id: String, user: UserType) {
    try {
      const response = await axios({
        method: "put",
        url: `${url}/${user_id}`,
        data: user,
      });

      console.log(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
    }
  }

  static async delete_user(user_id: String) {
    try {
      const response = await axios({
        method: "delete",
        url: `${url}/${user_id}`,
      });

      console.log(response);
      return response;
    } catch (e) {
      console.error(e);
    }
  }
}
