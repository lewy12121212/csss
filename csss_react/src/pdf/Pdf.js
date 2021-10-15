import '@progress/kendo-theme-material/dist/all.css';
import { useRef } from 'react';
import './pdf.scss';

import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";


function Pdf(props) {

    const pdfExportComponent = useRef(null);
    
    const handleExportWithComponent = (event) => {
      pdfExportComponent.current.save()
    }
    
    return (
      <div className='app-content'>
        <PDFExport ref={pdfExportComponent} paperSize="A4">
            <h1>KendoReact PDF Processing</h1>
            <p>This is an example of text that may be styled</p>
            <div className="button-area">
              <Button primary={true} onClick={handleExportWithComponent}>Export</Button>
            </div>
        </PDFExport>
      </div>
    );
  }
  
  export default Pdf;
  