import axios from "axios";
import { ProfileType } from "../models/profile";

//const backendAPI = `https://moments-server-6qo6tf2l7q-uc.a.run.app/api/profiles`; // NOTE atlas
const backendAPI = `http://localhost:8080/api/profiles`; // NOTE local

export class ProfileController {
  static async get_all() {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/`,
    });

    console.log(response.data);
    return response.data;
  }

  static async get(uid: string) {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/${uid}`,
    });

    return response.data;
  }

  static async update(uid: string, user: ProfileType) {
    const response = await axios({
      method: "put",
      url: `${backendAPI}/${uid}`,
      data: user,
    });

    console.log(response.data);
    return response.data;
  }
}
