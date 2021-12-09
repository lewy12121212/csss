import React from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import * as QRCode from 'easyqrcodejs';
import { dbAddress } from '../dbCon';
import ReactToPrint from 'react-to-print';

import InfoAlert from '../alerts/InfoAlert'
import DangerAlert from '../alerts/DangerAlert'
class QrGenerator extends React.Component {
  
  constructor(props) {
    super(props);
    this.qrcode = React.createRef();
    this.options = null;

    this.state = {
      qrBase64: "tekst-wstepny",
      showDangerAlert: false,
      showInfoAlert: false,
      alertMsg: {MainInfo: "", SecondaryInfo: ""}
    };
  }

  closeAlert(){
    this.setState({
      ...this.state,
      showInfoAlert: false,
      showDangerAlert: false,
      alertMsg: ({MainInfo: "", SecondaryInfo: ""})
    })
  }

  async componentDidMount(){
    await this.createQrContext(this.props.repairId)
    await this.createQrCode()
    this.saveQrCodeInDb(this.state.qrBase64)

  }

  createQrContext = (repairId) => {
    this.options = {
      text: `https://${dbAddress}:3000/Repairs/${repairId}`,
      width: 100,
      height: 100,
      colorDark: "#000000",
      colorLight: "#FFFFFF",
      //drawer: "svg" //To make QRcode in SVG
    };
  }

  createQrCode = () => {
    new QRCode(this.qrcode.current, this.options);
    let qrCanvas = this.qrcode.current.getElementsByTagName('canvas')[0]
    this.setState({
      ...this.state,
      qrBase64: qrCanvas.toDataURL()
    })
  }

  saveQrCodeInDb = () => {
    //TODO - show alerts from update QR-code
    axios.post(`https://${dbAddress}:4000/repair/addQRcode`, {qrcode: this.state.qrBase64, id: this.props.repairId}).then(response => {  
      console.log(response.data.message)
      //this.setState({
      //  ...this.state,
      //  alertMsg: {MainInfo: response.data.message, SecondaryInfo: ""},
      //  showInfoAlert: true
      //})
      //this.setState(prevState => ({
      //  alertMsg:{
      //    ...prevState.alertMsg,
      //    MainInfo: response.data.message
      //  },
      //  showInfoAlert: true
      //}));
    }).catch(error => {
      console.log(error.response.data.mainInfo)
      //this.setState({
      //  ...this.state,
      //  alertMsg: {MainInfo: error.response.data.mainInfo, SecondaryInfo: error.response.data.secondaryInfo},
      //  showDangerAlert: true,
      //})
    });
  }


  render() {
    return ( 
      <div className = "container">
        {this.state.showDangerAlert && <DangerAlert Content={this.alertMsg} CloseAlert={this.closeAlert}/>}
        {this.state.showInfoAlert && <InfoAlert Content={this.alertMsg} CloseAlert={this.closeAlert}/>}

        Qr dla zlecenia numer: {this.props.repairId} <br />

        <div ref={this.qrcode} hidden></div> 
        {/*this.baseToImage(this.qrBase64)
        <input type="text" onChange={this.handleChange} />
        <input type="button" value="Generuj QR code" onClick={this.createQrCode} />
        {this.state.qrBase64}
        <img src={this.state.qrBase64} alt="smutno" ref={(response) => (this.componentRef = response)}/>
        */}
        <img src={this.state.qrBase64} alt="smutno" ref={(response) => (this.componentRef = response)}/><br />
        <ReactToPrint
          content={() => this.componentRef}
          trigger={() => <button className="btn btn-success">Drukuj QrCode</button>}
        />
        <br />
        <NavLink className="btn btn-warning p-2" to="/EmployeeDashboard/Coordinator/Repairs">Lista zleceń</NavLink>
      </div>
    );
  }
}

export default QrGenerator;