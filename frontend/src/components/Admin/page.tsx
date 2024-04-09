import Header from "../Header/header";
import AdminMemoList from "./components/AdminMemoList";
import AdminUserList from "./components/AdminUserList";

export default function AdminPage() {
  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header />

      <h1 className="font-bold mt-6 text-blue-800 ">Admin Control Panel</h1>

      <h1 className="font-bold mt-6 text-blue-800 text-3xl">All Users</h1>
      <div className="relative flex">
        <div className="flex-grow border border-blue-800 mt-3 mb-3"></div>
      </div>

      <AdminUserList />

      <h1 className="font-bold text-blue-800 text-3xl">All Memos</h1>
      <div className="relative flex">
        <div className="flex-grow border border-blue-800 mt-3 mb-3"></div>
      </div>

      <AdminMemoList />
    </div>
  );
}
