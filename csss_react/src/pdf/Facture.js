import React from "react";
import './pdf.scss';
//import Form from "./Form";
//import Order from "./Order";
/*import logo from './logo_csss.png'


const logo = (e) => {
	return ( 
        <div className="logo-container">
            <img src="./logo_csss.png" alt=""/>
        </div>
    );
}*/

class Facture extends React.Component {
  render() {
    return (
      
        <table className="td_class col-10">

            <table>
              <tr><td rowspan="7" id="logo">CSSS</td></tr>
              <tr><td>Miejsce wystawienia</td></tr>
              <tr><td>Poznań</td></tr>
              <tr><td>Data wystawienia</td></tr>
              <tr><td>Data wystawienia</td></tr>
              <tr><td>Data wykonania usługi</td></tr>
              <tr><td>Data wykonania usługi</td></tr>
            </table>

            <table>
              <tr><th>Dane klienta</th><th>Dane firmy</th></tr>
              <tr><td>FIRMA</td><td>Computer Service Support System</td></tr>
              <tr><td>NIP</td><td>123 123456 1</td></tr>
              <tr><td>ULICA</td><td>Berdychowo</td></tr>
              <tr><td>MIASTO</td><td>Poznań</td></tr>
            </table>

            <table>
              <tr><th colspan="6">Faktura</th></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena Netto</td><td>Cena Brutto</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena Netto</td><td>Cena Brutto</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena Netto</td><td>Cena Brutto</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena Netto</td><td>Cena Brutto</td><td>Suma</td></tr>
              <tr><td>Id</td><td>Nazwa towaru lub usługi</td><td>Ilość</td><td>Cena Netto</td><td>Cena Brutto</td><td>Suma</td></tr>
              <tr><td colspan="3"></td><td>Razem</td><td>X</td></tr>
            </table>

            <table>
              <tr><td>Do zapłaty</td><td>X</td></tr>
            </table>

            <table>
              <tr><th>Podpis klienta</th><th>Podpis firmy</th></tr>
              <tr><td>X</td><td>X</td></tr>
            </table>

        </table>
      
    );
  }
}

export default Facture;