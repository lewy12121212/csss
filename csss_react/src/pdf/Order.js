import React from "react";
import './pdf.scss';

class TableComponent extends React.Component {
    render() {
      return (
        
          <table className="td_class col-10">

            <table>
                <tr><td rowspan="5" id="logo">CSSS</td></tr>
                <tr><td>Miejsce wystawienia</td></tr>
                <tr><td>Poznań</td></tr>
                <tr><td>Data wystawienia</td></tr>
                <tr><td>Data wystawienia</td></tr>
            </table>

            <table>
                <tr><th>Dane firmy</th></tr>
                <tr><td>Computer Service Support System</td></tr>
                <tr><td>123 123456 1</td></tr>
                <tr><td>Berdychowo</td></tr>
                <tr><td>Poznań</td></tr>
            </table>
  
            <table>
                <tr><th colspan="5">Zamówienie</th></tr>
                <tr><td>Id</td><td>Nazwa towaru</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
                <tr><td>Id</td><td>Nazwa towaru</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
                <tr><td>Id</td><td>Nazwa towaru</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
                <tr><td>Id</td><td>Nazwa towaru</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
                <tr><td>Id</td><td>Nazwa towaru</td><td>Ilość</td><td>Cena</td><td>Suma</td></tr>
                <tr><td colspan="3"></td><td>Razem</td><td>X</td></tr>
            </table>

            <table>
                <tr><th>Podpis firmy</th></tr>
                <tr><td>X</td></tr>
            </table>
  
          </table>
        
      );
    }
  }
  
  export default TableComponent;