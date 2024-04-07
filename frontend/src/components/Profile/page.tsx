import Header from "../Header/header";
import ProfileBanner from "./components/ProfileBanner";
import ProfileContent from "./components/ProfileContent";

export default function Profile() {
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get("id") || "";

  return (
    <main className="Profile w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header id={id}></Header>
      <ProfileBanner id={id}></ProfileBanner>
      <ProfileContent id={id}></ProfileContent>
    </main>
  );
}
