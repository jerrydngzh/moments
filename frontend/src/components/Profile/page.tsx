import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import Header from "../Header/header";
import ProfileBanner from "./components/ProfileBanner";
import ProfileContent from "./components/ProfileContent";

export default function Profile() {
  const { currentUser } = useFirebaseAuth();

  return (
    <main className="Profile w-2/3 text-left m-auto mt-10 bg-sky-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-sky-300">
      <Header />
      <ProfileBanner id={currentUser.uid}></ProfileBanner>
      <ProfileContent id={currentUser.uid}></ProfileContent>
    </main>
  );
}
