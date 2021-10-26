import "@progress/kendo-theme-bootstrap/dist/all.scss";

import { useRef } from 'react';
import './pdf.scss';

import { Button } from "@progress/kendo-react-buttons";
import { PDFExport } from "@progress/kendo-react-pdf";


function Pdf(props) {

    const pdfExportComponent = useRef(null);
    
    const handleExportWithComponent = (event) => {
      pdfExportComponent.current.save()
    }
    
    return (
      <div className='app-content'>
        <PDFExport ref={pdfExportComponent} paperSize="A4">
        <table className="container">
            
            <table border>
              <tr><th rowspan="7">CSSS</th></tr>
              <tr><td className="table-active">Miejsce wystawienia</td></tr>
              <tr><td>Poznań</td></tr>
              <tr><td className="table-active">Data wystawienia</td></tr>
              <tr><td>Data wystawienia</td></tr>
              <tr><td className="table-active">Data wykonania usługi</td></tr>
              <tr><td>Data wykonania usługi</td></tr>
            </table>

            <table><tr></tr></table>

            <table>
              <tr className="table-active"><th >Dane klienta</th><th>Dane firmy</th></tr>
              <tr><td>FIRMA</td><td>Center System Super Support</td></tr>
              <tr><td>NIP</td><td>NIP</td></tr>
              <tr><td>ULICA</td><td>ULICA</td></tr>
              <tr><td>MIASTO</td><td>Poznań</td></tr>
            </table>

            <table>
              <tr><th colspan="5">Faktura</th></tr>
              <tr className="table-active"><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
              <tr><td colspan="3"></td><td>Razem</td><td>X</td></tr>
            </table>

            <table>
              <tr><td>Do zapłaty:</td><td>X</td></tr>
            </table>

            <table>
              <tr><th>Podpis klienta</th><th>Podpis firmy</th></tr>
              <tr><td>X</td><td>X</td></tr>
            </table>

          </table>

            <div className="button-area">
              <Button primary={true} onClick={handleExportWithComponent}>Save</Button>
            </div>
        </PDFExport>
      </div>
    );
  }
  
  export default Pdf;
  