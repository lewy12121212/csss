import React from 'react';
import ReactToPrint from 'react-to-print';
import TableComponent from './Facture';
import './pdf.scss';
import NameForm from './Formularz'
 
class ExportPdfComponent extends React.Component {
     
    render() {
      return (
        <div>

          <TableComponent ref={(response) => (this.componentRef = response)} />
          
          <ReactToPrint
            content={() => this.componentRef}
            trigger={() => <button className="btn btn-primary">Print to PDF!</button>}
          />
        </div>
      );
    }
}
 
export default ExportPdfComponent;