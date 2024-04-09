import { useEffect, useState } from "react";
import Header from "../Header/header";
// import { MemoType } from "../../models/memo";
import { UserType } from "../../models/user";
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";

export default function AdminPage() {
  const [allMemos, setAllMemos] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);

  useEffect(() => {
    UserController.get_all()
      .then((data) => {
        setAllUsers(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });

    MemoController.get_all()
      .then((data) => {
        setAllMemos(data);
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

  async function handleDeleteMemo(uid: string, mid: string) {
    try {
      // Send delete request + update local list
      await MemoController.delete_memo(uid, mid);
      setAllMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== mid));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }

  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header></Header>

      <h1 className="font-bold mt-6 text-blue-800">All Users</h1>
      <div className="relative flex">
        <div className="flex-grow border border-blue-800 mt-3 mb-3"></div>
      </div>

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

      <h1 className="font-bold text-blue-800">All Memos</h1>
      <div className="relative flex">
        <div className="flex-grow border border-blue-800 mt-3 mb-3"></div>
      </div>
      {allMemos.length === 0 ? (
        <p className="text-blue-800">No memos found.</p>
      ) : (
        <table className="mt-3 mb-6 w-full">
          <thead>
            <tr>
              <th>Memo ID</th>
              <th>Created By</th>
              <th>Memo Title</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>
            {allMemos.map((memo) => (
              <tr key={memo._id}>
                <td>{memo._id}</td>
                <td>{memo.user_id}</td>
                <td>{memo.name}</td>
                <td>{memo.date}</td>
                <td>
                  <button
                    className="text-blue-800 bg-blue-100 border-blue-800 border-2 rounded-lg"
                    onClick={() => handleDeleteMemo(memo.user_id, memo._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
