import { useEffect, useState } from "react";
import { UserType } from "../../../models/user";
import { UserController } from "../../../controllers/user.controller";
import DeleteIcon from "./DeleteIcon";
import { useFirebaseAuth } from "../../../contexts/FirebaseAuth.context";

export default function AdminUserList() {
  const { currentUser } = useFirebaseAuth();
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
    // Dont allow admin to delete themselves...
    if (id === currentUser.uid) {
      alert("You shouldn't do that...");
      return;
    }

    try {
      // Send delete request + update local list
      if (confirm("Are you sure you want to delete this user?")) {
        await UserController.delete_user(id);
        setAllUsers((prevUsers) => prevUsers.filter((user) => user.uid !== id));
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }

  return (
    <>
      {allUsers.length === 0 ? (
        <p className="text-blue-800">No users found.</p>
      ) : (
        <table className="mt-3 mb-6 w-full text-sm">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="text-blue-800 bg-blue-100 border-blue-800 border-2 rounded-lg hover:bg-red-400"
                    onClick={() => handleDeleteUser(user.uid)}
                  >
                    <DeleteIcon></DeleteIcon>
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
