import React from 'react';
import './css/optionButton.css';

export default class OptionButton extends React.Component {

    render() {
      return (
        <div>
        <div className="optionChoice">
          <div className="mapType">
            <p> Choose map type to display (variables number): </p>
            <div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(2)}>2</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(3)}>3</button></div>
              <div className="buttonType"><button className="btn-type" onClick={() => this.props.setTypeMap(4)}>4</button></div>
            </div>
            <div>
              <p>Form: {this.props.typeSol}</p>
              <div >
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setTypeSol("SOP")}>SOP</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setTypeSol("POS")}>POS</button></div>
              </div>
            </div>
            <div>
              <p>Set map to all: </p>
              <div >
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare(0)}> 0</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare(1)}> 1</button></div>
                <div className="buttonSettings"><button className="btn-type" onClick={() => this.props.setMatrixSquare("X")}> X</button></div>
              </div>
            </div>
            <div>
              <p>Get the result: </p>
              <div>
                <div className="elaborate"><button className="btn-elaborate" id="elabora" onClick={(val) => this.props.onClick(val)}>Process</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    }
  }