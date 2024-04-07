import { useEffect, useState } from "react";
import { UserController } from "../../controllers/user.controller";
import Header from "../Header/header";
import { UserType } from "../../models/user";
import { ProfileType } from "../../models/profile";
import { ProfileController } from "../../controllers/profile.controller";

export default function Profile() {
  const [userData, setUserData] = useState<UserType>({
    uid: "",
    email: "",
    username: "",
    first_name: "",
    last_name: "",
  });
  const [profileData, setProfileData] = useState<ProfileType>({
    uid: "",
    bio: "",
    status_message: "",
    profile_picture: "",
  });
  const [id, setID] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get("id") || "";
    setID(idFromQuery);

    UserController.get_user_data(idFromQuery)
      .then((data) => {
        setUserData(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });
    ProfileController.get(idFromQuery)
      .then((data) => {
        setProfileData(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });
  }, []);

  const handleUpdateProfile = () => {
    ProfileController.update(id, profileData)
      .then((data) => {
        console.log("Profile updated successfully: ", data);
      })
      .catch((e) => {
        console.error("Error updating profile: ", e);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <main className="Profile w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header id={id}></Header>

      <h2 className="text-blue-800 text-3xl mb-4">User Profile</h2>

      {/* TODO: Extract user data section to component */}
      <p className="italic text-blue-800">
        Name: {userData.first_name} {userData.last_name}
      </p>
      <p className="italic text-blue-800">Username: {userData.username}</p>
      <p className="italic text-blue-800">Email: {userData.email}</p>

      {/* Extract profile data to component... */}

      {editMode ? (
        <>
          <input
            type="text"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            className="mb-2"
          />
          <input
            type="text"
            name="status_message"
            value={profileData.status_message}
            onChange={handleChange}
            className="mb-2"
          />
          <button
            onClick={() => setEditMode(false)}
            className="button-link text-blue-800 bg-blue-100 border-blue-800 border-2 p-2 text-center rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProfile}
            className="button-link text-blue-800 bg-blue-100 border-blue-800 border-2 p-2 text-center rounded-lg"
          >
            Update Profile
          </button>
        </>
      ) : (
        <>
          <p className="italic text-blue-800">
            Current Status: {profileData.status_message}
          </p>
          <p className="italic text-blue-800">User Bio: {profileData.bio}</p>
          <button
            onClick={() => setEditMode(true)}
            className="button-link text-blue-800 bg-blue-100 border-blue-800 border-2 p-2 text-center rounded-lg"
          >
            Edit Profile
          </button>
        </>
      )}
    </main>
  );
}
