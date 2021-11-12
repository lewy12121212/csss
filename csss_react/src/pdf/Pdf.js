import React from 'react';
import ReactToPrint from 'react-to-print';
import Facture from './Facture';
import Form from './Form'
import Order from "./Order";
import './pdf.scss';
 
class ExportPdfComponent extends React.Component {
     
    render() {
      return (
        <div>
          <Form/>
          <Facture ref={(response) => (this.componentRef = response)} />
          <Order ref={(response) => (this.componentRef = response)} />
          
          <ReactToPrint
            content={() => this.componentRef}
            trigger={() => <button className="btn btn-primary">Print to PDF!</button>}
          />
        </div>
      );
    }
}
 
export default ExportPdfComponent;