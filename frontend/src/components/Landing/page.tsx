import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="Title">
      <div className="text-center mt-20 m-auto w-1/3 pt-10 pb-10 bg-sky-200 border-2 border-sky-300 rounded-3xl">
        <h1 className="font-bold mb-1 text-sky-800">Moments</h1>
        <p className="text-sky-800 font-sm italic mb-4 m-auto">
          A Spatial Journaling App
        </p>
        <button
          onClick={() => navigate("/signin")}
          className="bg-sky-100 text-sky-800 mr-2"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-sky-100 text-sky-800"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}