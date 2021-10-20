import React, {useState} from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import { dbAddress } from '../../../dbCon';


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
  const [login, setLogin] = useState("")

  const handleInputChange = e => {
    setLogin(e.target.value)
  }
  
  const handleLogin = () => {
    setLoading(true);
    const table_of_img = []
    
    let i = 0;
    var time = setInterval(() => {      
      if(i === 10){
        clearInterval(time);
        setError(null);      
        axios.post(`http://${dbAddress}:4000/employee/faceRegistration`, { login: login, image: table_of_img }).then(response => {
        setLoading(false);
        alert("Zarejestrowano poprawnie."); //pamiętać wyrzucić!!!
        }).catch(error => {
          setLoading(false);
          if (error.response.status === 401) setError(error.response.data.message);
          else setError("Coś poszło nie tak...");
        });
      }
  
      table_of_img[i] = webcamRef.current.getScreenshot();
      i++;
    }, 1000)
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
      <button onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zarejestruj'}</button>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />

    </div>
  );
};

export default WebCamera;