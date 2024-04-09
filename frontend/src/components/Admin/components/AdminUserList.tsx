import { useEffect, useState } from "react";
import { UserType } from "../../../models/user";
import { UserController } from "../../../controllers/user.controller";

export default function AdminUserList() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  useEffect(() => {
    UserController.get_all()
      .then((data) => {
        setAllUsers(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });
  }, []);

  async function handleDeleteUser(id: string) {
    try {
      // Send delete request + update local list
      await UserController.delete_user(id);
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.uid !== id));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }

  return (
    <>
      {allUsers.length === 0 ? (
        <p className="text-blue-800">No users found.</p>
      ) : (
        <table className="mt-3 mb-6 w-full">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.uid}>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.uid}</td>
                <td>
                  <button
                    className="text-blue-800 bg-blue-100 border-blue-800 border-2 rounded-lg"
                    onClick={() => handleDeleteUser(user.uid)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
