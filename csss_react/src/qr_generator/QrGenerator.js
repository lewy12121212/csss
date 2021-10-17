import React from 'react';
import * as QRCode from 'easyqrcodejs';

class QrGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.qrcode = React.createRef();
    this.options = null;
  }

  handleChange = e => {
    this.options = {
      text: e.target.value,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#FFFFFF",
    };
  }

  handleOption = () => {
    new QRCode( this.qrcode.current, this.options);
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