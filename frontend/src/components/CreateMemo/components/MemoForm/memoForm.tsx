import { useEffect, useState } from "react";
import MapForm from "../LocationMapPicker/Map";
import SavedLocations from "../Locations/SavedLocations";
import MediaDisplay from "../MediaDisplay/MediaDisplay";

const MemoForm = (props: {
  onSubmit: (
    name: string,
    description: string,
    locationName: string,
    coordinates: [number, number],
    files: File[]
  ) => void;
  default_name: string;
  default_description: string;
  createMemo: boolean;
}) => {
  const [name, setName] = useState<string>(props.default_name);
  const [description, setDescription] = useState<string>(props.default_description);
  const [locationName, setLocationName] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    49.27326489299744, -123.10365200042726,
  ]);
  const [reloadDropdown, setReloadDropdown] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const submitedFiles = [...event.target.files];
    let parsedFiles: File[] = [];

    if (submitedFiles.length > 5) {
      alert("Please select a maximum of five files.");
      return;
    }
    for (const file of submitedFiles) {
      if (file.size > 15 * 1024 * 1024) {
        alert(`File ${file.name} exceeds the 15MB size limit.`);
        continue; // Skip this file
      }
      parsedFiles.push(file);
    }

    if (parsedFiles) {
      setFiles([...files, ...parsedFiles]);
    }
  };

  // TODO
  const handleFileRemove = (file: string) => {
    const updatedFiles = [...files];
    const index = updatedFiles.findIndex((f) => f.name === file);
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

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
      } else if (data.display_name) {
        setLocationName(data.display_name);
      } else {
        console.error("Error fetching location name: No display name in response");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
    }
  };

  const handleMapClick = (clickedLocation: [number, number]) => {
    setCoordinates(clickedLocation);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(name, description, locationName, coordinates, files);
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
    <div className="memo-form-container">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="map-container text-xl text-sky-800">
          <label htmlFor="location">Location</label>
          <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

          <MapForm selectedLocation={selectedLocation} onMapClick={handleMapClick} />
        </div>

        {/* Map-Location Name Label */}
        <div className="input-container mt-4">
          <label htmlFor="locationName">
            <span className="text-xl text-sky-800">Location Name</span>
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
        <div className="input-container mt-4">
          <label htmlFor="name" className="text-xl">
            <span className="text-sky-800">Title</span>
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

        {/* File Upload */}
        <div className="input-container">
          <label htmlFor="files" className="text-xl text-sky-800">
            Upload Files
          </label>
          <input type="file" id="files" name="files" multiple onChange={handleFileChange} />
        </div>

        <div className="input-container">
          {files.map((file) => (
            <div key={file.name}>
              <button onClick={() => handleFileRemove(file.name)}>Remove</button>
            </div>
          ))}
        </div>

        <MediaDisplay files={files} setelectedMemo={undefined} createMemo={props.createMemo} />

        {/* Description for the Memo */}
        <div className="input-container">
          <label htmlFor="memo" className="text-xl">
            <span className="text-sky-800">Memo</span>
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
            className="border-r-2 border-sky-200 text-xl text-sky-800 w-1/2 h-14 mb-2 mt-8 bg-sky-100 hover:bg-sky-50 rounded-xl"
            type="reset"
            value="Reset"
          />
          <input
            className="border-l-2 border-sky-200 text-xl text-sky-800 w-1/2 h-14 mb-8 bg-sky-100 hover:bg-sky-50 rounded-xl"
            type="submit"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
};

export default MemoForm;
