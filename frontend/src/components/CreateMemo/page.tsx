import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MapForm from "./components/LocationMapPicker/Map";
import SavedLocations from "./components/Locations/SavedLocations";
import { MemoController } from "../../controllers/memo.controller";
import { MemoType } from "../../models/memo";
import { UserController } from "../../controllers/user.controller";
import Header from "../Header/header";

const CreateMemo = ({}) => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState<any>(""); // FIXME - get user ID from session state (for itr2)
  const [name, setName] = useState<any>("");
  const [description, setMemo] = useState<any>("");
  const [locationName, setLocationName] = useState<any>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    49.27326489299744, -123.10365200042726,
  ]);
  const [reloadDropdown, setReloadDropdown] = useState<any>(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [userData, setUserData] = useState<any>({});

  const handleLocationSelected = (location: any) => {
    console.log(location);
    // Set the selected location in state
    setSelectedLocation(location);
  };

  const fetchCategories = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setUserID(idFromQuery);
      console.log(userID);

      // Fetch memo data from the server
      const data = await UserController.get_user_data(idFromQuery);

      console.log("Fetched Account:", data);

      setUserData(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get("is") || "";
    setUserID(idFromQuery);
    const fetchLocationName = async () => {
      const [lat, lon] = coordinates;

      try {
        // NOTE
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
        );

        if (!response.ok) {
          const data = await response.json();
          console.error(
            "Error fetching location name:",
            data.error || "Unknown error"
          );
          return;
        }

        const data = await response.json();

        if (data.display_name) {
          setLocationName(data.display_name);
        } else {
          console.error(
            "Error fetching location name: No display name in response"
          );
        }
      } catch (error) {
        console.error("Error fetching location name:", error);
      }
    };
    setReloadDropdown(true);
    fetchLocationName();
    fetchCategories();
  }, [coordinates, userID]);

  const handleMapClick = (clickedLocation: [number, number]) => {
    console.log(clickedLocation);
    setCoordinates(clickedLocation);
  };

  const handleDropdownReloaded = () => {
    // Reset reloadDropdown to false after the dropdown has been reloaded
    setReloadDropdown(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // TODO: better naming convention for the memo object fields of location
    const memoToCreate: MemoType = {
      name: name,
      date: new Date().toString(),
      location: {
        name: locationName,
        coordinates: [coordinates[0], coordinates[1]],
      },
      description: description,
    };

    try {
      const res = await MemoController.create_memo(userID, memoToCreate);
      // console.log(res)
      const newMemoId = res._id; // TODO

      // Update the memos array in userData with the new memo ID
      let newUserData: any = userData;
      newUserData.memos = [...userData.memos, newMemoId];

      setUserData(newUserData);

      const user = await UserController.update_user(userID, newUserData);
      console.log(user);

      navigate(`/dashboard?id=${userID}`);
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  const handleReset = () => {
    setLocationName("");
    setMemo("");
  };

  return (
    <main className="create-memo w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header id={userID}></Header>

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="text-3xl font-bold mb-6 mt-6 text-blue-800">
          Creating New Memo
        </h2>
        <div className="map-container">
          <label htmlFor="location" className="text-xl text-blue-800">
            Location
          </label>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet/dist/leaflet.css"
          />
          <MapForm
            selectedLocation={selectedLocation}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Map-Location Name Label */}
        <div className="input-container">
          <label htmlFor="locationName" className="text-xl text-blue-800">
            Location Name
          </label>
          <input
            type="text"
            id="locationName"
            name="locationName"
            className="location"
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
        </div>

        {/* Displays Saved Locations */}
        <SavedLocations
          reloadDropdown={reloadDropdown}
          id={userID}
          onDropdownReloaded={handleDropdownReloaded}
          onLocationSelected={handleLocationSelected}
        />

        {/* Title for Memo */}
        <div className="input-container">
          <label htmlFor="name" className="text-xl text-blue-800">
            Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description for the Memo */}
        <div className="input-container">
          <label htmlFor="memo" className="text-xl text-blue-800">
            Memo
          </label>
          <textarea
            id="memo"
            name="memo"
            className="memo"
            required
            value={description}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>
        <div className="button-container ">
          <input
            className="border-2 border-blue-800 w-full text-xl text-blue-800 h-14 mb-2 mt-8 bg-blue-100 hover:bg-white rounded-xl"
            type="reset"
            value="Reset"
          />
          <input
            className="border-2 border-blue-800 w-full text-xl text-blue-800 h-14 mb-8 bg-blue-100 hover:bg-white rounded-xl"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
    </main>
  );
};

export default CreateMemo;
