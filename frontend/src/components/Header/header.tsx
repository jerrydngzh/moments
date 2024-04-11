import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

export default function Header() {
  const { firebaseSignOut, isAdmin } = useFirebaseAuth();
  const location = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <header className="flex flex-row justify-between mb-10">
      <Link
        to={"/dashboard"}
        className={` ${
          location === "/dashboard" ? "bg-white" : "hover:bg-white"
        } button-link text-sky-800 bg-sky-100 w-1/4 p-2 border-sky-200 border-r-2 text-center rounded-2xl`}
      >
        Dashboard
      </Link>

      <Link
        to={"/lens"}
        className={`${
          location === "/lens" ? "bg-white" : "hover:bg-white"
        } button-link text-sky-800 bg-sky-100 w-1/4 p-2 border-sky-200 border-r-2 text-center rounded-2xl`}
      >
        Lens
      </Link>

      <Link
        to={"/createMemo"}
        className={`${
          location === "/createMemo" ? "bg-white" : "hover:bg-white"
        } button-link text-sky-800 bg-sky-100 w-1/4 p-2 border-sky-200 border-r-2 text-center rounded-2xl`}
      >
        Create Memo
      </Link>

      <Link
        to={"/profile"}
        className={`${
          location === "/profile" ? "bg-white" : "hover:bg-white"
        } button-link text-sky-800 bg-sky-100 w-1/4 p-2 border-sky-200 border-r-2 text-center rounded-2xl`}
      >
        Profile
      </Link>

      {isAdmin() ? (
        <>
          {" "}
          <Link
            to={"/admin"}
            className={` ${
              location === "/admin" ? "bg-white" : "hover:bg-white"
            } button-link text-sky-800 bg-sky-100 border-sky-200 border-r-2 w-1/4 p-2 text-center rounded-2xl`}
          >
            Admin Tools
          </Link>
        </>
      ) : (
        <></>
      )}

      <button
        onClick={async () => {
          firebaseSignOut()
            .then(() => {
              sessionStorage.removeItem("token");
              navigate("/");
            })
            .catch((e) => {
              alert(e.message);
            });
        }}
        className="button-link text-sky-800 bg-sky-100 w-1/4 p-2 text-center rounded-2xl"
      >
        Sign out
      </button>
    </header>
  );
}
