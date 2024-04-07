import { useEffect, useState } from "react";
import { UserController } from "../../../controllers/user.controller";
import { UserType } from "../../../models/user";

export default function ProfileBanner({ id }) {
  const [userData, setUserData] = useState<UserType>({
    uid: "",
    email: "",
    username: "",
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    UserController.get_user_data(id)
      .then((data) => {
        setUserData(data);
      })
      .catch((e) => {
        console.error("Error fetching accounts: ", e);
      });
  }, []);

  return (
    <>
      <h2 className="text-blue-800 text-3xl mb-4">User Profile</h2>

      {/* TODO: Extract user data section to component */}
      <img
        src={`https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&size=128`}
      ></img>
      <p className="italic text-blue-800">
        Name: {userData.first_name} {userData.last_name}
      </p>
      <p className="italic text-blue-800">Username: {userData.username}</p>
      <p className="italic text-blue-800">Email: {userData.email}</p>
    </>
  );
}
