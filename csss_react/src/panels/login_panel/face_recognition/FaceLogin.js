import React, {useState} from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import { dbAddress } from '../../../dbCon';


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

function FaceLogin (props) {

  const webcamRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [login, setLogin] = useState("")

  const handleInputChange = e => {
    setLogin(e.target.value)
  }


  const handleLogin = () => {
    setError(null);

    const image = webcamRef.current.getScreenshot();

    setLoading(true);
    console.log("error")
    axios.post(`http://${dbAddress}:4000/employee/faceLogin`, {image: image }).then(response => {
        setLoading(false);
        alert("Zalogowano!" + response.data.user); //pamiętać wyrzucić!!!
        }).catch(error => {
          setLoading(false);
          if (error.response.status === 401) setError(error.response.data.message);
          else setError("Coś poszło nie tak...");
        });


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
      <input type="text" onChange={handleInputChange}/>
      <button onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Logowanie'}</button>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />

    </div>
  );
};

export default FaceLogin