import React, { useRef } from 'react';
import * as QRCode from 'easyqrcodejs';


class QrGenerator extends React.Component {

    constructor(props) {
        super(props);
        this.qrcode = React.createRef();
    }

    componentDidMount() {
        // Options
        var options = {
            text: "https://github.com/ushelp/EasyQRCodeJS"
        }
        // Create new QRCode Object
        new QRCode( this.qrcode.current, options);
    }
    render() {
        return ( 
        <div className = "App">
          <div ref={this.qrcode}></div> 
        </div>
        );
    }
}

export default QrGenerator;