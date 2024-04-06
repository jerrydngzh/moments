import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserController } from "../../controllers/user.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import { UserCredential } from "firebase/auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { firebaseSignUp } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    let userCredentials: UserCredential = null;

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      userCredentials = await firebaseSignUp(email, password);
      const jwt = await userCredentials.user.getIdToken();
      sessionStorage.setItem("token", jwt);

      // TODO: disable button while waiting for user creation
    } catch (error) {
      // TODO: handle specific firebase errors
      //       1. invalid email, already in use, etc.
      alert(error.message);
      return;
    }

    try {
      // NOTE: make use of returned user object later in dashboard?
      // const user = ...
      await UserController.create_user({
        uid: userCredentials.user.uid,
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
      });

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
      // TODO: rollback firebase user creation, sign out user, clear jwt

      // TODO: enable button
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setFirstName("");
    setLastName("");
  };

  {
    /* FIXME: stying inputs */
  }
  return (
    <main className="Create-Account w-1/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Sign Up</h2>
        <label htmlFor="firstname" className="text-lg text-blue-800">
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
        <label htmlFor="lastname" className="text-lg text-blue-800">
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
        <label htmlFor="username" className="text-lg text-blue-800">
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
        <label htmlFor="email" className="text-lg text-blue-800">
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
        <label htmlFor="password" className="text-lg text-blue-800">
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
        <div className="mt-8 text-blue-800 flex">
          <input type="reset" value="Reset" className="border-blue-800 h-10 hover:bg-blue-50" />
          <input
            type="submit"
            value="Submit"
            className="border-blue-800 h-10 hover:bg-blue-50 ml-2 mr-2"
          />
          <input
            type="button"
            value="Back"
            onClick={() => navigate("/")}
            className="border-blue-800 h-10 hover:bg-blue-50"
          />
        </div>
      </form>
    </main>
  );
}
