import React from "react";
import './pdf.scss';
import Form from "./Form";

class TableComponent extends React.Component {
  render() {
    return (
      
        <table className="td_class col-10">

            <table>
              <tr><td rowspan="7" id="logo">CSSS</td></tr>
              <tr><td className="table-active">Miejsce wystawienia</td></tr>
              <tr><td>Poznań</td></tr>
              <tr><td className="table-active">Data wystawienia</td></tr>
              <tr><td>Data wystawienia</td></tr>
              <tr><td className="table-active">Data wykonania usługi</td></tr>
              <tr><td>Data wykonania usługi</td></tr>
            </table>

            

            <table>
              <tr className="table-active"><th >Dane klienta</th><th>Dane firmy</th></tr>
              <tr><td>FIRMA</td><td>Computer Service Support System</td></tr>
              <tr><td>NIP</td><td>123 123456 1</td></tr>
              <tr><td>ULICA</td><td>Berdychowo</td></tr>
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
      
    );
  }
}

export default TableComponent;