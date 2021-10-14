import React, {useState} from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import { dbAddress } from '../../../dbCon';
import { setUserSession } from '../../../utils/Common';

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
//const WebCamera = () => <Webcam />;
function WebCamera(props) {


  const webcamRef = React.useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setError(null);
      setLoading(true);
      axios.post(`http://${dbAddress}:4000/employee/faceRecognition`, { image: imageSrc }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push('/EmployeeDashboard');
      }).catch(error => {
        setLoading(false);
        if (error.response.status === 401) setError(error.response.data.message);
        else setError("Coś poszło nie tak...");
      });
      //console.log(imageSrc);

    }

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
      
      <button onClick={handleLogin}>Capture photo</button>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
    </div>
  );
};

export default WebCamera;