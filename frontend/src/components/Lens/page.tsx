import { useState, useEffect } from "react";
import Map from "./map";
import { Link } from "react-router-dom";
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";

// NOTE: removed "selectedCategories" property, iirc we arnt gonna be using it
interface Location {
  coordinates: [number, number];
  memo: { title: String; description: String; date: String }[];
}

export default function Lens() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userID, setUserID] = useState("");

  const fetchUserData = async () => {
    try {
      // FIXME: below may be deperacated in the future as we move to storing uuids in session storage/get in the auth context
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setUserID(idFromQuery);

      const userData = await UserController.get_user_profile(idFromQuery);

      console.log("Memos: ", userData.memos);
      fetchMemos(userData.memos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMemos = async (memos: String[]) => {
    try {
      // FIXME: userid should be saved earlier in fetchUserData
      //        this method of query search may be deperacated in the future as we get uids from auth context
      const fetchedLocations: Location[] = [];
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setUserID(idFromQuery);
      console.log("user: ", idFromQuery);

      for (const mid of memos) {
        const result = await MemoController.get_memo(idFromQuery, mid);

        const coordinates = result.location.coordinates;

        const memo = {
          title: result.name,
          description: result.description,
          date: result.date,
        };

        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(
          (loc) => loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]
        );

        if (existingLocationIndex !== -1) {
          // Location already exists, add memo to its memo array
          fetchedLocations[existingLocationIndex].memo.push(memo);
        } else {
          // Location doesn't exist, create a new Location object
          fetchedLocations.push({ coordinates: coordinates, memo: [memo] });
        }
      }

      setLocations(fetchedLocations);

      console.log("locations: ", locations);
      console.log("memos: ", memos);
    } catch (error) {
      console.error("Error fetching memo data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    console.log(locations);
  }, []);

  return (
    <div className="lens w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      {/* TODO: Issue #43 */}
      <header className="flex flex-row justify-between mb-4">
        <Link
          to={"/createMemo?id=" + userID + ""}
          className="button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg"
        >
          Create Memo
        </Link>
        <Link
          to={"/profile?id=" + userID + ""}
          className="button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg"
        >
          Profile
        </Link>
        <Link
          to={"/dashboard?id=" + userID + ""}
          className="button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg"
        >
          Dashboard
        </Link>
      </header>

      <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

      <Map locations={locations} />

      {/* FIXME separate into its own component -> a list view is a common reusable component that 
                shows up in our application: lens, dashboad, management, etc. 
      */}
      <div>
        {locations.map(() => (
          <div>
            {locations.map((location, locIndex) => (
              <table key={locIndex} className="w-full table-auto">
                <thead className="justify-between">
                  <tr className="bg-blue-950">
                    <th className="px-16 py-2">
                      <span className="text-blue-100">Title</span>
                    </th>
                    <th className="px-16 py-2">
                      <span className="text-blue-100">Memo</span>
                    </th>
                    <th className="px-16 py-2">
                      <span className="text-blue-100">Date</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {location.memo.map((memo, memoIndex) => (
                    <tr key={memoIndex} className="bg-blue-100">
                      <td className="px-16 py-2 font-bold">{memo.title}</td>
                      <td className="px-16 py-2">{memo.description}</td>
                      <td className="px-16 py-2">{memo.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
