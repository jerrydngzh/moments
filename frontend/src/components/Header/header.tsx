import { Link, useLocation } from "react-router-dom";

export default function Header({ id }) {
  const location = useLocation().pathname;

  return (
    <header className="flex flex-row justify-between mb-4">
      <Link
        to={"/dashboard?id=" + id}
        className={` ${
          location === "/dashboard" ? "bg-white" : "hover:bg-white"
        } button-link text-blue-800 bg-blue-100 border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg`}
      >
        Dashboard
      </Link>

      <Link
        to={"/lens?id=" + id}
        className={`${
          location === "/lens" ? "bg-white" : "hover:bg-white"
        } button-link text-blue-800 bg-blue-100 border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg`}
      >
        Lens
      </Link>

      <Link
        to={"/createMemo?id=" + id}
        className={`${
          location === "/createMemo" ? "bg-white" : "hover:bg-white"
        } button-link text-blue-800 bg-blue-100 border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg`}
      >
        Create Memo
      </Link>

      <Link
        to={"/profile?=" + id}
        className={`${
          location === "/profile" ? "bg-white" : "hover:bg-white"
        } button-link text-blue-800 bg-blue-100 border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg`}
      >
        Profile
      </Link>

      <Link
        to={"/signin"}
        className={
          "button-link text-blue-800 bg-blue-100 border-blue-800 hover:bg-white border-2 w-1/4 p-2 text-center rounded-lg"
        }
      >
        Log out
      </Link>
    </header>
  );
}
