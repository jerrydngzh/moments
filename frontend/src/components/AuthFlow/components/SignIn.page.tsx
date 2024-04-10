import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../../../contexts/FirebaseAuth.context";

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
      const userCredential = await firebaseSignIn(email, password);
      setLoading(false);

      if (!userCredential.user.emailVerified) {
        navigate("/verify");
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      setLoading(false);
      alert(e.message);
    }
  };

  function BackButton() {
    return (
      <>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/3 mb-6"
        >
          Back
        </button>
      </>
    );
  }

  {
    /* FIXME: stying inputs */
  }
  return (
    <main className="Create-Profile w-1/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <BackButton />
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Log in</h2>
        <label htmlFor="email" className="text-lg text-blue-800">
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
        <label htmlFor="password" className="text-lg text-blue-800">
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

        <div className="mt-8 text-blue-800">
          <input
            type="reset"
            value="Reset"
            disabled={loading}
            className="mb-2 border-blue-800 h-10 hover:bg-blue-50"
          />
          <input
            type="submit"
            value="Submit"
            disabled={loading}
            className="border-blue-800 h-10 hover:bg-blue-50"
          />
        </div>
      </form>
    </main>
  );
}
