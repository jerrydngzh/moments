import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserController } from "../../controllers/user.controller";

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const validate = () => {
    // account details validation
    const { email, password } = userData;

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return null;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // NOTE: allowing duplicate username as each user will have unique id

    const error = validate();
    if (error) {
      console.error(error);
      alert(error);
      return;
    }

    try {
      // Create new User
      const user = await UserController.create_user(userData);
      console.log("Successfully created user: ", user);
      navigate("/user");
    } catch (error) {
      console.error("Error creating account:", error);
      // TODO: Provide user feedback (e.g., set an error state)
    }
  };

  function BackButton() {
    return (
      <button
        onClick={() => navigate("/")}
        className="bg-blue-100 text-blue-800 border-2 border-blue-800 w-1/3 mb-6"
      >
        Back
      </button>
    );
  }

  return (
    <main className="Create-Account w-1/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <BackButton></BackButton>
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Create Account
        </h2>
        <label htmlFor="firstname" className="text-lg text-blue-800">
          First Name
        </label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={userData.first_name}
          required
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              first_name: e.target.value,
            }))
          }
        />
        <label htmlFor="lastname" className="text-lg text-blue-800">
          Last Name
        </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={userData.last_name}
          required
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              last_name: e.target.value,
            }))
          }
        />
        <label htmlFor="username" className="text-lg text-blue-800">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={userData.username}
          required
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              username: e.target.value,
            }))
          }
        />

        <label htmlFor="email" className="text-lg text-blue-800">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          value={userData.email}
          required
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              email: e.target.value,
            }))
          }
        />

        <label htmlFor="password" className="text-lg text-blue-800">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          required
          onChange={(e) =>
            setUserData((prevUserData) => ({
              ...prevUserData,
              password: e.target.value,
            }))
          }
        />

        <div className="mt-8 text-blue-800">
          <input
            type="reset"
            value="Reset"
            className="mb-2 border-blue-800 h-10 hover:bg-blue-50"
          />
          <input
            type="submit"
            value="Create Account"
            className="border-blue-800 h-10 hover:bg-blue-50"
          />
        </div>
      </form>
    </main>
  );
}
