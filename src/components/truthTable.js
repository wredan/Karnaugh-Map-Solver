import React from 'react';
import './css/truthTable.css';
import {TableSquare, SelectionButton} from './buildComponents.js';

//CLASSI RELATIVE ALLA TABELLA DI VERITA'
export default class TruthTable extends React.Component {
  
    render() {
      const sel = this.props.squares;
      const typeMap = this.props.typeMap;
      const perm = this.props.perm;
      let i = 0;
  
      return (
        <div key={i++}>
          <TableH
            typeMap={typeMap}
            key={i++} />
          <div className="bodyTruthTable" key={i++}>
            <Permutation
              key={i++}
              typeMap={typeMap}
              perm={perm}
            />
            <TableValSelection
              squares={sel}
              typeMap={typeMap}
              perm={perm}
              key={i++}
              onClick={(i, j) => this.props.onClick(i, j)}
              setRowOrColCell={(i, j, k, val) => this.props.setRowOrColCell(i, j, k, val)} />
          </div>
        </div>
      );
    }
  
  }
  
class Permutation extends React.Component { //componente che genera le permutazioni

    renderTableSquare(val, i) { //qui genera le celle col valore 0 se la i (col modulo in quanto di alternano a volte gli 1 e 0 POME SPIEGO MEGLIO)
      return (
        <TableSquare
          value={val}
          key={i}
          className="square tableFont"
        />
      );
    }
    renderTableCol2(j, perm) {
      const typeMap = this.props.typeMap;
      //console.log(perm);
      var html = [];
      let temp = Math.pow(2, typeMap);
  
      for (let i = 0; i < temp; i++) {       //celle generate secondo un ciclo, esse sono sicuramente 2^typeMap per ogni colonna
        html.push(this.renderTableSquare(perm[i][j], i));
      }
      return html;
    }
  
    renderTableCol(j, perm) {     //colonna per unità binaria (esempio in decimale -> centinaia, decina, unità ecc)
      return (
        <div className="table-col" key={j}>
          {this.renderTableCol2(j, perm) // questa genera effettivamente le celle
          }
        </div>
      );
    }
    renderTablePermutation(perm) {
      const typeMap = this.props.typeMap;
      var html = [];      //array di ritorno dove faccio push elementi
  
      for (let j = 0; j < typeMap; j++)   //ciclo for che genera le colonne
        html.push(this.renderTableCol(j, perm)); //push in array delle colonne da mettere nel div delle permutazioni  
  
      return html;
    }
    render() {
      const perm = this.props.perm;
      //chiamo la funzione per generare le permutazioni
      return this.renderTablePermutation(perm);
    }
  }
  
class TableH extends React.Component {    //componente che genera l header della tabella
    renderTableHead(a, i) {
      return (
        <TableSquare value={a} key={i} k={i} className="square tableFont" />
      );
    }
  
    renderTableRow() {
      const typeMap = this.props.typeMap;
      let alphabet = ["A", "B", "C", "D"];
      let a = [];
      let i = 0
      for (; i < typeMap; i++)
        a.push(this.renderTableHead(alphabet[i], i));
      a.push(this.renderTableHead("R", i + 1));
      return a;
  
    }
    render() {
      return <div className="tableHead" key={-1}> {this.renderTableRow()} </div>;
    }
  }
    
class TableValSelection extends React.Component { //componente che genera i bottoni della tabella
  
    renderSelectionButton(i, j, k) {
      return (
        <SelectionButton
          value={this.props.squares[i][j][0]}
          onClick={() => this.props.onClick(i, j)} //viene passata onClick la funzione handleClick di KMap con la rispettiva cella di riferimento
          key={k}
        />
      );
    }
  
    renderTableCol() { //inizializzazione dei bottoni in modo da sincronizzare la matrice con la tabella (vedere setCoord in KMap)
      const typeMap = this.props.typeMap;
      let a = [];
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        c = 4;
        r = 2;
      }
      let key = 0;                  //porzione di codice uguale a setCoord in KMap (sincronizza bottoni e matrice)
      for (let i = 0; i < c; i++) {
        let l;
        if (i === 2) l = 3;
        else if (i === 3) l = 2;
        else l = i;
        for (let j = 0; j < r; j++) {
          let k;
          if (j % r === 2) k = 3;
          else if (j % r === 3) k = 2;
          else k = j;
          a.push(this.renderSelectionButton(k, l, key++));
        }
      }
      return a;
    }
  
    render() {
      return <div className="table-col-selButton"> {this.renderTableCol()} </div>;
    }
  }  