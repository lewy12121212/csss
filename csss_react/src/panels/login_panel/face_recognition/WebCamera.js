import React, {useState} from "react";
import Webcam from "react-webcam";

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
//const WebCamera = () => <Webcam />;
function WebCamera(props) {


  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      //console.log(imageSrc);

    },
    [webcamRef, setImgSrc]
  );

  return (
    <div>
      <Webcam
        audio={false}
        mirrored={true}
        imageSmoothing={true}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      
      <button onClick={capture}>Capture photo</button>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="pic1"
        />
      )}
    </div>
  );
};

export default WebCamera;