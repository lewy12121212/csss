import React, {useState} from "react";
import Webcam from "react-webcam";
import axios from 'axios';
import { dbAddress } from '../../../dbCon';

import "../login.scss"

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

  const [buttonReg, setButtonReg] = useState();
  //const [login, setLogin] = useState("")

  //const handleInputChange = e => {
  //  setLogin(e.target.value)
  //}
  
  const handleLogin = () => {
    setLoading(true);
    const table_of_img = []
    
    let i = 0;
    var time = setInterval(() => {      
      if(i === 3){
        clearInterval(time);
        setError(null);
        setWarning("Przetwarzanie...");    
        axios.post(`https://${dbAddress}:4000/employee/faceRegistration`, { login: props.login, image: table_of_img }).then(response => {
          setWarning("Twarz zarejestrowana poprawnie!");
          setLoading(false);
          setButtonReg(true)
          //handleModifyModel()

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
    setLoading(true);
    axios.post(`https://${dbAddress}:4000/employee/modifyFaceModel`).then(response => {
      setWarning("Poprawnie zmodyfikowano model");
      setLoading(false);
      setButtonReg(false)
    
    }).catch(error => {
      setLoading(false);
      setWarning(null);
      setError(error.response.data.message);
      //if (error.response.status === 401) 
      //else setError("Coś poszło nie tak...");
    });
  }

  return (
    <div className="col-12 mt-3 align-items-center text-center">
      <Webcam className="col-12 webcamViewRegistration"
        audio={false}
        mirrored={true}
        imageSmoothing={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      {/*<input type="text" onChange={handleInputChange}/>*/}

      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}
      {warning && <><small style={{ color: 'green' }}>{warning}</small><br /></>}

      {!buttonReg && <button className="btn btn-primary col-8 col-md-6 col-lg-4 mt-3" onClick={handleLogin} disabled={loading}>{loading ? 'Ładowanie...' : 'Zarejestruj'}</button>}
      {buttonReg && <button className="btn btn-primary col-8 col-md-6 col-lg-4 mt-3" onClick={handleModifyModel} disabled={loading}>{loading ? 'Ładowanie...' : 'Kliknij aby przetworzyć'}</button>}
      {/*<button onClick={handleModifyModel}>Modyfikuj model</button>*/}


    </div>
  );
};

export default FaceRegistration;