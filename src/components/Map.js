import React from 'react';
import './css/Map.css';
import {TableSquare,Square} from './buildComponents.js';


export default class Map extends React.Component {
    //metodi per renderizzare la mappa
    renderSquare(i, j) {
      return (
        <Square
          value={this.props.squares[i][j][0]}
          i={i}
          j={j}
          onClick={() => this.props.onClick(i, j)}
          key={i + j}
        />
      );
    }
  
    generateMapRow(i) {
      const typeMap = this.props.typeMap;
      let a = [];
      let t = typeMap;
      if (typeMap === 3)
        t = 4;
      for (let j = 0; j < t; j++)
        a.push(this.renderSquare(i, j));
  
      return a;
    }
    renderMapRow(i) {
      return (
        <div className="board-row" key={i}>
          {this.generateMapRow(i)}
        </div>
      );
    }
    renderMap() {
      const typeMap = this.props.typeMap;
      let a = [];
      let t = typeMap;
      if (typeMap === 3)
        t = 2;
      for (let i = 0; i < t; i++)
        a.push(this.renderMapRow(i));
  
      return a;
    }
    //metodi per renderizzare gli elementi ai lati della mappa
    renderMapHead(check, a, className) {
      const typeMap = this.props.typeMap;
      if (check)
        return (
          <TableSquare
            value={a}
            key={a}
            className={className} />
        );
      else {
        let temp = [];
        let alp = ["A", "B", "C", "D"];
        let flag = false;
        let i = 0
        for (; i < typeMap; i++) {
          if ((typeMap !== 2 && i === 2) || (typeMap === 2 && i === 1)) {
            temp.push(<hr key={"hr"} />);
            flag = true;
          }
          if (!flag)
            temp.push(<div className="mapVariableTop" key={i} >{alp[i]}</div>);
          else
            temp.push(<div className="mapVariableBot" key={i} >{alp[i]}</div>);
  
        }
  
        return (
          <TableSquare
            value={temp}
            key={++i}
            className={className} />
        );
      }
  
    }
  
    renderHeader() {
      const typeMap = this.props.typeMap;
      let string = ["00", "01", "11", "10"];
      let t = typeMap;
      let a = [];
      if (typeMap === 3)
        t = 4;
      if (typeMap === 2)
        string = ["0", "1"];
      a.push(this.renderMapHead(0, "", "headerSquare"));
      for (let i = 0; i < t; i++)
        a.push(this.renderMapHead(1, string[i], "headerSquare"));
  
      return a;
  
    }
    renderMapHeaderRow(i) {
      return <div className="board-row" key={i}> {this.renderHeader()} </div>
    }
  
    renderCol() {
      const typeMap = this.props.typeMap;
      let string = ["00", "01", "11", "10"];
      let t = typeMap;
      let a = [];
      if (typeMap === 2 || typeMap === 3) {
        string = ["0", "1"];
        t = 2;
      }
  
      for (let i = 0; i < t; i++)
        a.push(this.renderMapHead(1, string[i], "headerSquare"));
  
      return a;
  
    }
  
    rendeMapReaderCol(i) {
      return <div className="map-col" key={i}> {this.renderCol()} </div>
    }
  
    render() { //Definisco la struttura della mappa
      let i = 0;
      return (
        <div key={i++}>
          {this.renderMapHeaderRow(i++)}
          {this.rendeMapReaderCol(i++)}
          <div className="map">
            {this.renderMap()}
          </div>
        </div>
      );
    }
  }