const backendAPI = `${import.meta.env.VITE_BACKEND_API}/api/profiles`;

import axios from "axios";
import { ProfileType } from "../models/profile";


export class ProfileController {
  static async get_all(): Promise<ProfileType[]> {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/`,
    });

    return response.data;
  }

  static async get(uid: string): Promise<ProfileType> {
    const response = await axios({
      method: "get",
      url: `${backendAPI}/${uid}`,
    });

    return response.data;
  }

  static async update(uid: string, user: ProfileType): Promise<ProfileType> {
    const response = await axios({
      method: "put",
      url: `${backendAPI}/${uid}`,
      data: user,
    });

    return response.data;
  }
}
