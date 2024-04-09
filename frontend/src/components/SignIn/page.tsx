import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

export default function SignInPage() {
  const { firebaseSignIn } = useFirebaseAuth();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      setLoading(true);
      await firebaseSignIn(email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (e) {
      setLoading(false);
      alert(e.message);
    }
  };

  return (
    <main className="Create-Profile w-1/3 text-left m-auto mt-10 bg-sky-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-sky-300">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-800">Log in</h2>
        <label htmlFor="email" className="text-lg italic text-sky-800">
          Email:
          <input
            type="text"
            id="email"
            name="email"
            className="email"
            required
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label htmlFor="password" className="text-lg italic text-sky-800">
          Password:
          <input
            type="text"
            id="password"
            name="password"
            className="password"
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <div className="mt-8 text-sky-800 flex">
          <input
            type="button"
            value="Back"
            disabled={loading}
            onClick={() => navigate("/")}
            className="h-10 bg-sky-100 hover:bg-sky-50"
          />
          <input
            type="reset"
            value="Reset"
            disabled={loading}
            className="h-10 bg-sky-100 hover:bg-sky-50 ml-2 mr-2"
          />
          <input
            type="submit"
            value="Submit"
            disabled={loading}
            className="h-10 bg-sky-100 hover:bg-sky-50"
          />
        </div>
      </form>
    </main>
  );
}
