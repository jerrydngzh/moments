import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="Title">
      <div className="text-center mt-20 m-auto w-1/3 pt-10 pb-10 bg-blue-200 border-2 border-blue-800 rounded-3xl">
        <h1 className="font-bold mb-1 text-blue-800">Moments</h1>
        <p className="text-blue-800 font-sm italic mb-4">
          A Spatial Journalling App
        </p>
        <button
          onClick={() => navigate("/user")}
          className="bg-blue-100 text-blue-800 border-2 border-blue-800 mr-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/createAccount")}
          className="bg-blue-100 text-blue-800 border-2 border-blue-800"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}
