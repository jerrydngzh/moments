const storageBucket = `https://storage.googleapis.com/${import.meta.env.VITE_STORAGE_BUCKET}`;

const MediaDisplay = (props: { files: File[]; media: string[]; createMemo: boolean }) => {
  // Function to render media based on its type
  const renderMedia = (mediaData: File, index: number) => {
    if (mediaData.type.startsWith("image")) {
      return <img key={index} src={URL.createObjectURL(mediaData)} alt={`Media ${index + 1}`} />;
    } else if (mediaData.type.startsWith("video")) {
      return (
        <video key={index} controls>
          <source src={URL.createObjectURL(mediaData)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else if (mediaData.type.startsWith("audio")) {
      return (
        <audio key={index} controls>
          <source src={URL.createObjectURL(mediaData)} type="audio/mp3" />
          Your browser does not support the audio tag.
        </audio>
      );
    } else {
      // Handle unsupported media types
      return <div key={index}>Unsupported media type</div>;
    }
  };

  // NOTE: rendering media from storage bucket
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop().toLowerCase();
  };
  const renderURL = (mediaName: string, index: number) => {
    const url = `${storageBucket}/${mediaName}`;
    const fileExtension = getFileExtension(mediaName);

    switch (fileExtension) {
      case "jpg":
      case "jpeg":
      case "png":
        return <img key={index} src={url} alt={`Media ${index + 1}`} />;
      case "mp4":
      case "webm":
        return (
          <video key={index} controls>
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "mp3":
      case "wav":
        return (
          <audio key={index} controls>
            <source src={url} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return (
          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
            Media {index + 1}
          </a>
        );
    }
  };

  return (
    <div>
      <h2>Media List</h2>
      <div>
        {props.createMemo &&
          props.files.map((mediaData, index) => (
            <div key={index}>{renderMedia(mediaData, index)}</div>
          ))}
        {!props.createMemo &&
          props.media!.map((mediaName, index) => (
            <div key={index}>{renderURL(mediaName, index)}</div>
          ))}
      </div>
    </div>
  );
};

export default MediaDisplay;