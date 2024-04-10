import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserController } from "../../controllers/user.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import { UserCredential } from "firebase/auth";

export default function SignUpPage() {
  const { firebaseSignUp, firebaseDeleteUser } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let userCredentials: UserCredential = null;

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      userCredentials = await firebaseSignUp(email, password);
    } catch (error) {
      // TODO: handle specific firebase errors
      //       1. invalid email, already in use, etc.
      setLoading(false);
      alert(error.message);
      return;
    }

    try {
      await UserController.create_user({
        uid: userCredentials.user.uid,
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
      });

      navigate("/dashboard");
      setLoading(false);
    } catch (error) {
      await firebaseDeleteUser();
      setLoading(false);
      alert(error.message);
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
  };

  return (
    <main className="Create-Account w-1/3 text-left m-auto mt-10 bg-sky-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-sky-300">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="text-3xl font-bold mb-6 text-center text-sky-800">Sign Up</h2>
        <label htmlFor="firstname" className="text-lg italic text-sky-800">
          First Name
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={first_name}
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label htmlFor="lastname" className="text-lg italic text-sky-800">
          Last Name
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={last_name}
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <label htmlFor="username" className="text-lg italic text-sky-800">
          Username
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label htmlFor="email" className="text-lg italic text-sky-800">
          Email
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="text-lg italic text-sky-800">
          Password
          <input
            type="text"
            id="password"
            name="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
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
