import React from 'react';
import axios from 'axios';
import * as QRCode from 'easyqrcodejs';
import { dbAddress } from '../dbCon';

class QrGenerator extends React.Component {
  
  constructor(props) {
    super(props);
    this.qrcode = React.createRef();
    this.options = null;

    this.state = {
      qrBase64: "tekst-wstepny"
    };
  }

  componentDidMount(){
    this.createQrContext(this.props.repairId)
    this.createQrCode()
  }

  createQrContext = (repairId) => {
    this.options = {
      text: `https://${dbAddress}:3000/Repairs/${repairId}`,
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#FFFFFF",
      //drawer: "svg" //To make QRcode in SVG
    };
  }

  createQrCode = () => {
    new QRCode(this.qrcode.current, this.options);
    let qrCanvas = this.qrcode.current.getElementsByTagName('canvas')[0]
    //this.qrBase64 = qrCanvas.toDataURL()
    this.setState({
      ...this.state,
      qrBase64: qrCanvas.toDataURL()
    })

    //var qrBase64 = qrCanvas.toDataURL()
    //console.log(qrCanvas.toDataURL())
    console.log(this.state.qrBase64)

  }

  baseToImage = (qrBase64) => {
    var image = new Image();
    image.src = qrBase64;
    return image;
  }

  saveQrCodeInDb = (qrBase64) => {
    //axios.get(`https://${dbAddress}:4000/qr`, {qrcode: this.qrcode }).then(response => {
    //}).catch(error => {
    //});
  }


  render() {
    return ( 
      <div className = "App">
        Qr dla zlenenia numer: {this.props.repairId}
        
        {/*this.baseToImage(this.qrBase64)*/}
        {/*<input type="text" onChange={this.handleChange} />
        <input type="button" value="Generuj QR code" onClick={this.createQrCode} />*/}
        <div ref={this.qrcode}></div> 
        {this.state.qrBase64}
        <img src={this.state.qrBase64} alt="smutno"/>

      </div>
    );
  }
}

export default QrGenerator;