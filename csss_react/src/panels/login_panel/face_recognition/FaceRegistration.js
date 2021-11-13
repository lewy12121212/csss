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
function FaceRegistration(props) {

  const webcamRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [login, setLogin] = useState("")

  const handleInputChange = e => {
    setLogin(e.target.value)
  }
  
  const handleLogin = () => {
    setLoading(true);
    const table_of_img = []
    
    let i = 0;
    var time = setInterval(() => {      
      if(i === 3){
        clearInterval(time);
        setError(null);
        setWarning("Twarz zarejestrowana - przetwarzanie...");    
        axios.post(`http://${dbAddress}:4000/employee/faceRegistration`, { login: login, image: table_of_img }).then(response => {
          setWarning("Twarz zarejestrowana poprawnie!");
          handleModifyModel()

        }).catch(error => {
          setLoading(false);
          setWarning(null);
          setError(error.response.data.message);
          //if (error.response.status === 401) 
          //else setError("Coś poszło nie tak...");
        });
      }
  
      table_of_img[i] = webcamRef.current.getScreenshot();
      i++;
    }, 1000)
  }

  const handleModifyModel = () => {

    axios.post(`http://${dbAddress}:4000/employee/modifyFaceModel`).then(response => {
      setWarning("Poprawnie zmodyfikowano model");
      setLoading(false);
    
    }).catch(error => {
      setLoading(false);
      setWarning(null);
      setError(error.response.data.message);
      //if (error.response.status === 401) 
      //else setError("Coś poszło nie tak...");
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
      <button onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zarejestruj'}</button>
      {/*<button onClick={handleModifyModel}>Modyfikuj model</button>*/}
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      {warning && <><small style={{ color: 'green' }}>{warning}</small><br /></>}

    </div>
  );
};

export default FaceRegistration;