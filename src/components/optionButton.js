import React from 'react';
import './css/optionButton.css';

export default class OptionButton extends React.Component {

    render() {
      return (
        <div>
        <div className="optionChoice">
          <div className="mapType">
            <p> Scegli il tipo di mappa da visualizzare (numero di variabili): </p>
            <div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(2)}>2</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(3)}>3</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(4)}>4</button></div>
            </div>
            <div>
              <p>Risultato in forma: {this.props.typeSol}</p>
              <div >
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setTypeSol("SOP")}>SOP</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setTypeSol("POS")}>POS</button></div>
              </div>
            </div>
            <div>
              <p>Impostare la mappa a valori tutti: </p>
              <div >
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare(0)}> 0</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare(1)}> 1</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare("X")}> X</button></div>
              </div>
            </div>
            <div>
              <p>Ottenere il risultato: </p>
              <div>
                <div className="elaborate"><button className="btn-elaborate" id="elabora" onClick={(val) => this.props.onClick(val)}>Elabora</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }