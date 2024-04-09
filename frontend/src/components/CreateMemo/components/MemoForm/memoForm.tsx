import { useEffect, useState } from "react";
import MapForm from "../LocationMapPicker/Map";
import SavedLocations from "../Locations/SavedLocations";

const MemoForm = (props:{ 
  onSubmit:( name:string, description:string, locationName:string, coordinates:[number,number] ) => void, 
  default_name:string, 
  default_description:string 
  }) => {
  const [name, setName] = useState<string>(props.default_name);
  const [description, setDescription] = useState<string>(props.default_description);
  const [locationName, setLocationName] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number,number]>([49.27326489299744, -123.10365200042726]);
  const [reloadDropdown, setReloadDropdown] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");


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

      if (data.name) {
        setLocationName(data.name);
      } 
      else if(data.display_name){
        setLocationName(data.display_name);
      }
      else {
        console.error("Error fetching location name: No display name in response");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };


  const handleMapClick = (clickedLocation:[number,number]) => {
    setCoordinates(clickedLocation);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(name, description, locationName, coordinates );
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setLocationName("");
  };

  useEffect(() => {
    setReloadDropdown(true);
    fetchLocationData();
  }, [coordinates]);

  return (
    <div className="memo-form-container" >

    <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="map-container">
          <label htmlFor="location" className="text-xl text-blue-800">
            Location
          </label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
         
        <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
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
                onChange={(e) => setDescription(e.target.value)}
            />
            </label>
        </div>

        <div className="button-container">
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
        </div>
    );
    };

    export default MemoForm;
