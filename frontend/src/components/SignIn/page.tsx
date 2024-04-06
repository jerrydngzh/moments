import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { UserController } from "../../controllers/user.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

export default function SignInPage() {
  const { firebaseSignIn } = useFirebaseAuth();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: {
    preventDefault: () => void;
    target: any;
  }) => {
    event.preventDefault();
    try {
      const userCredentials = await firebaseSignIn(email, password);
      const jwt = await userCredentials.user.getIdToken();
      sessionStorage.setItem("372-jwt", jwt);

      navigate("/dashboard");
    } catch (e) {
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
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Log in
        </h2>
        <label htmlFor="email" className="text-lg text-blue-800">
          Email:
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password" className="text-lg text-blue-800">
          Password:
        </label>
        <input
          type="text"
          id="password"
          name="password"
          className="password"
          required
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="mt-8 text-blue-800">
          <input
            type="reset"
            value="Reset"
            className="mb-2 border-blue-800 h-10 hover:bg-blue-50"
          />
          <input
            type="submit"
            value="Submit"
            className="border-blue-800 h-10 hover:bg-blue-50"
          />
        </div>
      </form>
    </main>
  );
}
