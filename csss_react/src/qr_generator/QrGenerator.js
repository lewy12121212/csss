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
      count: 0
    };
  }

  handleChange = e => {
    this.options = {
      text: e.target.value,
      width: 300,
      height: 300,
      colorDark: "#000000",
      colorLight: "#FFFFFF",
      //drawer: "svg" //To make QRcode in SVG
    };
  }

  handleOption = () => {
    new QRCode(this.qrcode.current, this.options);

    var qrCanvas = this.qrcode.current.getElementsByTagName('canvas')[0]
    var qrBase64 = qrCanvas.toDataURL()
    console.log(qrBase64)

    axios.get(`https://${dbAddress}:4000/qr`, {qrcode: this.qrcode }).then(response => {

    }).catch(error => {

    });

  }

  render() {
    return ( 
      <div className = "App">
        <input type="text" onChange={this.handleChange} />
        <input type="button" value="Generuj QR code" onClick={this.handleOption} />
        <div ref={this.qrcode}></div> 
      </div>
    );
  }
}

export default QrGenerator;