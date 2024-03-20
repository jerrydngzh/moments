const backendAPI = `http://localhost:3000/api/users`;
import { User } from '../models/user';
import axios from 'axios';

class UserController {
    async get_user_profile(user_id: String) {}

    async create_user(user_id: String, user: User) {}

    async update_user(user_id: String, user: User) {}

    async delete_user(user_id: String) {}
}