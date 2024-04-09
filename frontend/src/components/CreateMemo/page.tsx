import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import MapForm from "./components/LocationMapPicker/Map";
import SavedLocations from "./components/Locations/SavedLocations";
import Header from "../Header/header";

import { MemoController } from "../../controllers/memo.controller";
import { MemoType } from "../../models/memo";

import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";

const CreateMemo = ({}) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setMemo] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    49.27326489299744, -123.10365200042726,
  ]);
  const [reloadDropdown, setReloadDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { currentUser } = useFirebaseAuth();

  const fetchLocationData = async () => {
    const [lat, lon] = coordinates;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Error fetching location name:", data.error || "Unknown error");
        return;
      }

      const data = await response.json();

      if (data.display_name) {
        setLocationName(data.display_name);
      } else {
        console.error("Error fetching location name: No display name in response");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
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
      await MemoController.create_memo(currentUser.uid, memoToCreate);

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating memo:", error);
    }
  };

  const handleReset = () => {
    setLocationName("");
    setMemo("");
  };

  useEffect(() => {
    setReloadDropdown(true);
    fetchLocationData();
  }, [coordinates]);

  return (
    <main className="create-memo w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header />

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <h2 className="text-3xl font-bold mb-6 mt-6 text-blue-800">Creating New Memo</h2>

        <div className="map-container">
          <label htmlFor="location" className="text-xl text-blue-800">
            Location
          </label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
          <MapForm
            selectedLocation={selectedLocation}
            onMapClick={(clickedLocation: [number, number]) => setCoordinates(clickedLocation)}
          />
        </div>

        {/* Map-Location Name Label */}
        <div className="input-container">
          <label htmlFor="locationName" className="text-xl text-blue-800">
            Location Name
            <input
              type="text"
              id="locationName"
              name="locationName"
              className="location"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </label>
        </div>

        {/* Displays Saved Locations */}
        <SavedLocations
          reloadDropdown={reloadDropdown}
          id={currentUser.uid}
          onDropdownReloaded={() => setReloadDropdown(false)}
          onLocationSelected={(location) => setSelectedLocation(location)}
        />

        {/* Title for Memo */}
        <div className="input-container">
          <label htmlFor="name" className="text-xl text-blue-800">
            Title
            <input
              type="text"
              id="name"
              name="name"
              className="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>

        {/* Description for the Memo */}
        <div className="input-container">
          <label htmlFor="memo" className="text-xl text-blue-800">
            Memo
            <textarea
              id="memo"
              name="memo"
              className="memo"
              required
              value={description}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>
        </div>

        {/* Button Nav Bar */}
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
