import React from 'react';
import './css/buildComponents.css';

//componenti utilizzate per generare elementi grafici
export class TableSquare extends React.Component{       //componente che genera le celle col valore interno
    render(){
        return (
            <div className={this.props.className}> {this.props.value}</div>
          );
    }
  }
  
  export class SelectionButton extends React.Component {  
    render(){
        return (
        <div className="selectionButton">
          <button className="btn btn-Tab" onClick={this.props.onClick}>
            {this.props.value}
          </button>
        </div>
      );
    }
  }

  export class Square extends React.Component {
       render(){
        return (
            <div className="mapSquare" onClick={this.props.onClick}>
              <button className="btnMap">
                {this.props.value}
                <div className="" id={"" + this.props.i + this.props.j}></div>
              </button>
            </div>
          );
       } 
    }