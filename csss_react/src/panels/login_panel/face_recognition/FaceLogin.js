import React, {useState} from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import { dbAddress } from '../../../dbCon';

import '../login.scss'


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

function FaceLogin (props) {

  const webcamRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //const [login, setLogin] = useState("")
  //
  //const handleInputChange = e => {
  //  setLogin(e.target.value)
  //}


  const handleLogin = () => {
    setError(null);
    const image = webcamRef.current.getScreenshot();
    setLoading(true);
    props.handleFaceLogin(image, setLoading, setError);
  }

  return (
    <div className="col-12 mt-3 align-items-center text-center">
      <Webcam className="col-12 webcamView"
        audio={false}
        mirrored={true}
        imageSmoothing={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
        videoConstraints={videoConstraints}
      />
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
      <button className="col-10 col-md-8 col-lg-8 global-btn local-employee-btn loginButton" onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zaloguj'}</button>
      {/*<button onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Logowanie'}</button>*/}
    </div>
  );
};

export default FaceLogin