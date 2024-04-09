import { useEffect, useState } from "react";
import { MemoController } from "../../../controllers/memo.controller";
// import { MemoType } from "../../../models/memo";

export default function AdminMemoList() {
  const [allMemos, setAllMemos] = useState<any[]>([]);

  useEffect(() => {
    MemoController.get_all()
      .then((data) => {
        setAllMemos(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });
  }, []);

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
    <>
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
    </>
  );
}
