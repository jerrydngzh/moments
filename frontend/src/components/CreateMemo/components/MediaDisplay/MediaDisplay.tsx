const MediaDisplay = (props:{ files:string[] }) => {
    // Function to render media based on its type
    const renderMedia = (mediaData:string, index:number) => {
        if (mediaData.startsWith('data:image')) {
            return <img key={index} src={mediaData} alt={`Media ${index + 1}`} />;
        } else if (mediaData.startsWith('data:video')) {
            return (
                <video key={index} controls>
                    <source src={mediaData} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (mediaData.startsWith('data:audio')) {
            return (
                <audio key={index} controls>
                    <source src={mediaData} type="audio/mp3" />
                    Your browser does not support the audio tag.
                </audio>
            );
        } else {
            // Handle unsupported media types
            return (
                <div key={index}>
                    Unsupported media type
                </div>
            );
        }
    };

    return (
        <div>
            <h2>Media List</h2>
            <div>
                {props.files.map((mediaData, index) => (
                    <div key={index}>
                        {/* Render media based on its type */}
                        {renderMedia(mediaData, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaDisplay;
