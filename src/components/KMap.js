import React from 'react';
import './css/KMap.css';
import './css/drawGroup.css';
import $ from 'jquery';
import Map from './Map.js';
import TruthTable from './truthTable.js';
import OptionButton from './optionButton.js';

export default class KarnaughMap extends React.Component {
    constructor(props) {
      super(props);
  
      let t = 4;
      let a = this.getMatrixSquare(t);
      let p = this.getMatrixPerm(t);
      let m = this.setCoord(a, p, t);
      let s = "SOP";
      this.state = {
        squares: m,   //matrice
        typeMap: t,   //tipo di mappa da generare 
        perm: p,      //mattrice permutazioni
        typeSol: s    //SOP o POS
      };
    }
  
    //metodo che restituisce la matrice dei valori binari in base alla dimensione inserità
    getMatrixPerm(dim) {
      let col = dim;
      let row = Math.pow(2, dim);  //il num di righe è dato dalla potenza del due rispetto la dim inserita
      let a = [];                   //matrice di appoggio
      for (let i = 0; i < row; i++) {   //composizione della matrice (inserimento delle colonne per ogni riga)
        let temp = [];
        for (let j = 0; j < col; j++)
          temp[j] = 0;
        a[i] = temp;
      }
  
      for (let j = 0; j < col; j++) {       //composizione dei valori binari(viene effettuato l'inserimento per colonna)
        let count = (Math.pow(2, dim)) / 2; //count delimita il numero di 0 e 1 da inserire
  
        for (let i = 0; i < row; i++) {     //ciclo che scorre le righe
          let val = (i % (count * 2) < count) ? 0 : 1;  //inserisce 0 ogni primo elemento di riga finché minore di count
          a[i][j] = "" + val;                          //il modulo è usato perché all'iterno del ciclo il processo di alternanza di 0 e 1 si ripete più volte
        }
        dim--;                        //dim viene descrementato in modo da generare il count esatto per ogni posizione dei bit
      }
      return a;
    }
  
    getMatrixSquare(dim) {      //genera la matrice che compone la mappa
      let row = dim;
      let col = dim;
      let deep = 2;             //è una matrice a tre dimensioni dove nella [.][.][0] troviamo il valore della mappa, in [.][.][1] e[.][.][2] le coordinate
                                //rispettivamente di colonna e riga
      if (dim === 3) {          //Controllo caso 3 variabili
        row = 2;
        col = 4;
      }
  
      let a = [];                   //settaggio della matrice ad inserimento dei vettori uno dentro l'altro
      for (let i = 0; i < row; i++) {
        let temp = [];
        for (let j = 0; j < col; j++) {
          let t = [];
          for (let k = 0; k < deep; k++)
            t[k] = 0;
          temp[j] = t;
        }
        a[i] = temp;
      }
      return a;
    }
  
    setMatrixSquare(val) {                //metodo che setta il valore della matrice rispettivamente ad 1, 0 o X
      const squares = this.state.squares;
      const typeMap = this.state.typeMap;
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        r = 2;
        c = 4;
      }
      for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) {
          squares[i][j][0] = val;
        }
      
      this.reset();
      this.setState({
        squares: squares,
      });
    }
  
    reset(){                              //metodo di reset dove si risettano le impostazioni per effettuare un nuovo calcolo
      const typeMap = this.state.typeMap;
      let r = typeMap;
      let c = typeMap;
      if (typeMap === 3) {
        r = 2;
        c = 4;
      }
      $("#elabora").prop("disabled", false);  //risetta il bottone in able
  
      for (let i = 0; i < r; i++)             //rimuove il disegno dei gruppi
        for (let j = 0; j < c; j++) {
          $("#" + i + j).removeClass();
          $("#" + i + j).html("");
          for (let k = 0; k < 10; k++)
            $("#" + i + j + k).remove();          
        }
      
        $("#sol").html("");                 //rimuove la soluzione
        $("#costo").html("");
        $(".Solution").hide();
        $(".Solution").css("left","720px");
    }
  
    setCoord(squares, perm, typeMap) { //codice che setta le coordinate visibili sopra e nel lato della mappa
      let r = typeMap;            //squares[i][j][0] = elemento mostrato nella matrice
      let c = typeMap;            //squares[i][j][1] = coord della colonna
      //squares[i][j][2] = coord della riga
      if (typeMap === 3) {          //controllo tipo mappa 3 variabili
        c = 4;
        r = 2;
      }
      for (let i = 0; i < c; i++) {   //primo for che scorre le colonne
        let l;
        if (i === 2) l = 3;          //si attuano le dovute inversioni
        else if (i === 3) l = 2;
        else l = i;
  
        for (let j = 0; j < r; j++) { //for annidato che scorre le righe
          let k;
          if (j % r === 2) k = 3;       //si attuano le dovute inversioni
          else if (j % r === 3) k = 2;
          else k = j;
          //inizio setting coordinate
          let val = "";
          let t = typeMap;
  
          let p = 0;
          //metodo per separare nelle due cellele rispettive coord di colonna e riga
          do {
            val += perm[i * r + j][p];    //i*r+j formula che permette di scorrere l'array come fosse una matrice di r righe e c colonne
            p++;
          } while (p < t / 2);
          squares[k][l][1] = val;   //setting della colonna
          val = "";
          p = Math.floor(t / 2);
          if (typeMap === 3) {        //caso matrice 3 variabili
            t = 2;
            p = Math.floor(t / 2 + 1);
          }
          do {
            val += perm[i * r + j][p];
            p++;
          } while (p < t);
          squares[k][l][2] = val; //setting della riga
          //console.log("vett: "+(i*r+j)+" col: "+l+"  rig: "+k); 
        }
      }
      // console.log(squares);
      return squares;
    }
  
    setTypeMap(val) {                     //setta il tipo di mappa e ciò che ne consegue per effettuare un calcolo pulito
      let a = this.getMatrixSquare(val);
      let b = this.getMatrixPerm(val);
      let c = this.setCoord(a, b, val);
      this.reset();
      this.setState({
        typeMap: val,
        squares: c,
        perm: b,
      });
    }
  
    setTypeSol(type){   //setta il tipo di soluzione desiderato (SOP o POS)
      this.reset();
      this.setState({
        typeSol: type
      })
    }
  
    handleClick(i, j) { // Viene invocata quando si preme sopra il quadrato e ne cambia il contenuto (1,0,X)
      const squares = this.state.squares; //Salvo i valori che si trovano su squares perchè non posso modificarli in modo diretto
      if (squares[i][j][0] === 'X')
        squares[i][j][0] = 0;
  
      else if (squares[i][j][0] === 0)
        squares[i][j][0] = 1;
      else
        squares[i][j][0] = 'X';

      this.reset();
      this.setState({ //Dove aver fatto la dovuta modifica, aggiorno lo stato
        squares: squares,
      });
    }
  
    
    Algorithm(squares) {
  
      $("#elabora").prop("disabled", true);
      var dimCol, dimRig;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRig = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRig = 2;
        }
        else {
          dimCol = 2;
          dimRig = 2;
        }
  
      var groups = new Array(dimRig); //creo le righe
  
      for (let i = 0; i < dimRig; i++) {
        groups[i] = new Array(dimCol); //creo le colonne
  
        for (let j = 0; j < dimCol; j++)
          groups[i][j] = []; //per ogni cella creo un array
      }
  
      var index = 0; // per indicare i vari gruppi(temporanei);
      for (let i = 0; i < dimRig; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          var count = 0; // mi conta quanti elementi ho trovato(temporaneamente), serve per vedere se è una potenza del 2
  
          if (squares[i][j][0] === val) { //squares[i][j] è l'elemento selezionato
            //Lascio invariato il valore di i ed j
            var TempI = i;
            var TempJ = j;
  
            if (j === dimCol - 1)//mi trovo nell'ultima colonna, faccio i controlli per i bordi
            {
              let ok = true;
              let count2 = 0;
  
              for (let altezza = i; altezza < dimRig && ok; altezza++)
                if (squares[altezza][dimCol - 1][0] === val && squares[altezza][0][0] === val) {
                  groups[altezza][0].push(index);
                  groups[altezza][dimCol - 1].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[i + count2 - 1][0].pop();
                  groups[i + count2 - 1][dimCol - 1].pop();
                } 
              }
  
            }
  
            if (i === dimRig - 1)//mi trovo nell'ultima riga, faccio i controlli per i bordi
            {
              let ok = true;
              let count2 = 0;
  
              for (let colonna = j; colonna < dimCol && ok; colonna++)
                if (squares[dimRig - 1][colonna][0] === val && squares[0][colonna][0] === val) {
                  groups[dimRig - 1][colonna].push(index);
                  groups[0][colonna].push(index);
                  count2++;
                }
                else
                  ok = false;
  
              if (count2 > 0) {
                index++;
  
                if (!isPower(2, count2)) {
                  groups[dimRig - 1][j + count2 - 1].pop();
                  groups[0][j + count2 - 1].pop();
                }
              }
  
            }
  
            do { //Controllo le caselle orizzontali ad esso
              groups[TempI][TempJ].push(index); //Indico che ho trovato un gruppo collegato con l'elemento selezionato
              count++;
              TempJ++;
            } while (TempJ < dimCol && squares[TempI][TempJ][0] === val);
            //ATTENZIONE: MANCA IL CONTROLLE PER LE CASELLE AI BORDI
  
            if (!isPower(2, count)) //count è una potenza del 2 ?
            {
              groups[TempI][TempJ - 1].pop(); //elimino l'ultimo elemento inserito
              count--;
            }
  
            var CountVer;
            var depth = 100; //mi indica quante righe sono valide della colonna dell'elemento selezionato
            var isOk = true; // Serve a controllare se vi è una interruzione di una colonna
            for (let spostamento = 0; spostamento < count; spostamento++) { //per ogni colonna 
              TempI = i + 1;
              TempJ = j + spostamento;
              CountVer = 1;
  
              while (TempI < dimRig && CountVer < depth) {
                if (squares[TempI][TempJ][0] !== val) {
                  if (spostamento !== 0 && CountVer !== depth) { //serve ad evitare squilibri inutili all'intero dei gruppi, mi permette di "marchiare" gruppi effettivamente utilizzabili.
  
                    var rig = TempI;
                    if (!isPower(2, spostamento))//nel caso di una matrice 4x4 solo se spo=3
                    {
                      //Necessario perchè fino a questo punto non sapevo se il gruppo che stavo creando fosse effettivamente valido o meno, visto che sono entrato qui dentro
                      //devo eliminare SOLO i gruppi creati non più validi
  
                      if (!isPower(2, CountVer)) //bisogna avere il riferimento dell'altezza rispetto l'elemento selezionato
                        rig--;
  
                      groups[TempI][TempJ].push(index); //evito di mettere dei controlli nei cicli di sotto, non posso eliminare qualcosa che non ho inserito.
  
                      if (TempI >= depth) //in base dove mi trovo, dovrò basarmi sull'altezza del gruppo(depth) oppure sull'altezza in cui mi trovo.
                        depth = TempI;
                      else
                        depth--;
  
                      for (; rig <= depth; rig++)
                        for (let col = TempJ - 1; col <= spostamento; col++)
                          groups[rig][col].pop();
  
                      isOk = false; // per il controllo di sotto
                    }
                  }
                  break;
                }
                groups[TempI][TempJ].push(index);
                TempI++;
                CountVer++;
              }
  
              if (CountVer < depth)
                depth = CountVer;
  
              if (!isPower(2, CountVer) && isOk) { //essendo che ho già "ripulito" quando ho settato isOk a falso, non ho bisogno di rifarlo
                groups[TempI - 1][TempJ].pop();
                depth--;
              }
            }
            index++;
          }
        }
  
      }
      console.log("Algorithm:");
      console.log(groups);
      this.GroupUp(squares, $.extend(true, [], groups));
    }
  
    GroupUp(squares, values) {
      var groups = [];
  
      var group1 = [];
      var group2 = [];
      var obj1, obj2;
      var dimCol, dimRig;
      const typeSol = this.state.typeSol;
      let val = (typeSol === "SOP")? 1 : 0 ;
  
      if (this.state.typeMap === 4) {
        dimCol = 4;
        dimRig = 4;
      }
      else
        if (this.state.typeMap === 3) {
          dimCol = 4;
          dimRig = 2;
        }
        else {
          dimCol = 2;
          dimRig = 2;
        }
  
      if(squares[0][0][0]===val && squares[0][dimCol-1][0]===val && squares[dimRig-1][0][0]===val && squares[dimRig-1][dimCol-1][0]===val)
      {
  
        obj1 = {
          riga: 0,
          col: 0
        };
  
        group1.push(obj1);
        
        obj1 = {
          riga: 0,
          col: dimCol-1
        };
  
        group1.push(obj1);
        
        obj1 = {
          riga: dimRig-1,
          col: 0
        };
  
        group1.push(obj1);
  
        obj1 = {
          riga: dimRig-1,
          col: dimCol-1
        };
  
        group1.push(obj1);
  
        groups.push(group1);
  
        group1=[];
       
      }
  
      for (let i = 0; i < dimRig; i++) {
        for (let j = 0; j < dimCol; j++) {
  
          if (squares[i][j][0] === val) { //squares[i][j] è l'elemento selezionato
  
            var index = values[i][j][0];
            var InizioRiga = i;
            var InizioCol = j;
  
            if (j === dimCol - 1) {
              while (InizioRiga < dimRig && values[InizioRiga][j][0] === index && values[InizioRiga][0][0] === index) {
  
                obj1 = {
                  riga: InizioRiga,
                  col: 0
                };
  
                obj2 = {
                  riga: InizioRiga,
                  col: j
                };
  
                values[InizioRiga][j].shift();
                values[InizioRiga][0].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                InizioRiga++;
              }
  
              if (group1.length > 0) {
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              InizioRiga = i;
              InizioCol = j;
  
            }
  
            if (i === dimRig - 1) {
              while (InizioCol < dimCol && values[i][InizioCol][0] === index && values[0][InizioCol][0] === index) {
  
                obj1 = {
                  riga: i,
                  col: InizioCol
                };
  
                obj2 = {
                  riga: 0,
                  col: InizioCol
                };
  
                values[0][InizioCol].shift();
                values[i][InizioCol].shift();
  
                group1.push(obj1);
                group1.push(obj2);
  
                InizioCol++;
              }
  
              if (group1.length > 0) {
                group1.sort(function (a, b) { return a.riga - b.riga }); //faccio un ordinamento per dimensione
                groups.push(group1);
                group1 = [];
                index = values[i][j][0];
              }
  
  
              InizioRiga = i;
              InizioCol = j;
            }
  
            while (InizioCol < dimCol && values[InizioRiga][InizioCol][0] === index)
              InizioCol++;
  
            while (InizioRiga < dimRig && values[InizioRiga][InizioCol - 1][0] === index)
              InizioRiga++;
  
  
            for (let FineRiga = i; FineRiga < InizioRiga; FineRiga++)
              for (let FineCol = j; FineCol < InizioCol; FineCol++) {
                obj1 = {
                  riga: FineRiga,
                  col: FineCol
                };
                group1.push(obj1);
              }
  
            groups.push(group1);
  
            InizioRiga = i;
            InizioCol = j;
  
            while (InizioRiga < dimRig && values[InizioRiga][InizioCol][0] === index)
              InizioRiga++;
  
            while (InizioCol < dimCol && values[InizioRiga - 1][InizioCol][0] === index)
              InizioCol++;
  
            for (let FineRiga = i; FineRiga < InizioRiga; FineRiga++)
              for (let FineCol = j; FineCol < InizioCol; FineCol++) {
                obj1 = {
                  riga: FineRiga,
                  col: FineCol
                };
                group2.push(obj1);
              }
  
            var equal = true;
            if (group1.length === group2.length)
            {
              for (let v = 0; v < group1.length && equal; v++)
                if (group1[v].riga !== group2[v].riga && group1[v].col !== group2[v].col)
                  equal = false;
            }
                  else
                  groups.push(group2);
  
            if (!equal)
             groups.push(group2);
  
            group1 = [];
            group2 = [];
  
            for (let k = 0; k < dimRig; k++)
              for (let z = 0; z < dimCol; z++)
                if (values[k][z][0] === index)
                  values[k][z].shift();
  
          }
  
        }
      }
      console.log("GroupUp:");
      console.log(groups);
      this.CleanAlgorithm($.extend(true, [], groups));
    }
    
    CleanAlgorithm(groups) {
      groups.sort(function (a, b) { return a.length - b.length }); //faccio un ordinamento per dimensione
      groups.reverse(); //inverto l'ordine, in modo tale da avere quelli più "grandi" di sopra
  
      console.log("CleanAlgorithm:");
      console.log(groups);
  
       var temp = $.extend(true, [], groups); //deep copy
       
       for(let i=0; i<temp.length; i++){              //for che mantiene il punto del gruppo i
        for(let j=i+1; j<temp.length; j++){           //for che scorre i gruppi successivi da confrontare con il gruppo i
  
          if(temp[i].length<temp[j].length){          //Controllo se il gruppo i considerato è maggiore del gruppo j, se non lo è
            let p=i;                                  //fa uno swap in modo da far scendere il gruppo considerato finché non ne trova un altro con dimensione minore o uguale
            while(temp[p].length<temp[p+1].length){   //Effettivo swap.
              let t = temp[p];                        //Faccio ciò in modo tale che i gruppi maggiori vengano sempre confrontati con i gruppi minori, 
              temp[p]=temp[p+1];                      //in modo da azzerarli se essi risultano interni ad un altro gruppo
              temp[p+1]=t;
  
              t = groups[p];                          //scambio di posizione anche nel gruppo principale
              groups[p]=groups[p+1];
              groups[p+1]=t;
            }
          }
  
          for(let k=0; k<temp[i].length; k++){          //for che si occupa di scorrere le celle del gruppo i
            for(let l=0; l<temp[j].length; l++)         //for che si occupa di scorrere le celle del gruppo j, in modo da compararle con quelle del gruppo i
              if((temp[i][k].riga===temp[j][l].riga) && (temp[i][k].col===temp[j][l].col)){     //se ne trova una in entrambi i gruppi
                for(let p=l;p<temp[j].length-1;p++) temp[j][p] = temp[j][p+1];                  //fa uno shift degli elementi fino alla fine del gruppo ( in modo da eliminare la cella nel gruppo j)
                delete temp[j][temp[j].length-1];        //cancella l'ultima cella dal vettore
                temp[j].length--;                       //riduco la dimensione del vettore j considerato                            
              }     
          }   
        }
      }
  
        var trovato,eliminato,obj1,value;
    for (let v = 0; v < groups.length; v++) 
    {
        eliminato = true;
      if (temp[v].length>0)
        for (let index = 0; index < groups[v].length && eliminato; index++) 
        {
          obj1 = groups[v][index];
          trovato = false;
          for (let k = 0; k < groups.length && !trovato; k++)
          {
  
            if (v !== k && temp[k].length>0) 
            {
              value = groups[k].findIndex((obj2) => obj1.riga === obj2.riga && obj1.col === obj2.col); 
              if (value !== -1) 
                trovato = true;
            }
          }
  
            if(trovato===false)
             eliminato=false;
        }
  
        if(eliminato===true)//significa che ogni oggetto di groups[v] è stato trovato.
         temp[v]=[];
  
      }
      console.log(temp);
      this.Solution(temp, groups);
      this.drawGroup(temp, groups);
    }
  
    Solution(temp, groups) {                         //temp è un array con le coordinate dei gruppi corretti
      const matrice = this.state.squares;           //matrice principale
      var alp = ["A", "B", "C", "D"];               //array con i nomi delle variabili della matrice
      var soluzione="";                              //stringa per calcolare la soluzione di un gruppo
      var vettoreSol=[];                              //ogni elemento è la soluzione di un gruppo
      var k, j, t;
      //k è l'indice per scorrere l'array alp, j è l'indice per scorrere le coordinate dei gruppi, t è l'indice per scorrere le coordinate binarie
      var elementoR, elementoC;                    //queste due variabili contengono la Riga e la Colonna del primo elemento di un gruppo, che è il punto di riferimento
      var flag;                                    //variabile sentinella
      var coord;                                  //variabile che contiene la coordinata binaria in uso
      var ner;
      var tipoSol=this.state.typeSol;
      for (let i = 0; i < temp.length; i++) {
  
        if (temp[i].length > 0) {
          k = 0;
          elementoR = groups[i][0].riga;              //estrazione coordinate del punto di riferimento per ogni gruppo
          elementoC = groups[i][0].col;
  
          ner = 0;
          while (ner < groups[i].length && groups[i][ner].riga === elementoR)  //contatore che indica il numero di elementi in una riga (usato per le colonne)
          {
            ner++;
          }
  
          //INIZIO CONTROLLO DELLA RIGA
          t = 0;
          coord = matrice[elementoR][elementoC][1];  //coord contiene la coordinata binaria nella colonna del punto di riferimento
          while (t < coord.length) {
            j = 1;
            flag = true;
            while (j < groups[i].length && groups[i][j].riga === elementoR) {       //finchè gli elementi si trovano sulla stessa riga
              if (coord.charAt(t) !== matrice[elementoR][groups[i][j].col][1].charAt(t)) {  //controlla i singoli caratteri delle coordinate binarie nelle colonne degli elementi appartenenti al gruppo
                flag = false;                                               //se trova che i caratteri sono diversi, la variabile non viene considerata e si esce dal ciclo
                break;
              }
              j++;
            }
            if (flag) {                        //viene aggiornata la soluzione solo se i caratteri risultano tutti uguali
              if(tipoSol==="SOP")                //forma SOP
              {
                if (coord.charAt(t) === "0") {
                  soluzione += "'" + alp[k];
                }
                else{
                  soluzione += alp[k];
                }
              }
              else{                               //forma POS
                if (coord.charAt(t) === "0") {
                  soluzione += alp[k];
                }
                else{
                  soluzione += "'" + alp[k];
                }
                soluzione += "+";
              }
            }
            k++;
            t++;
          }
  
          //INIZIO CONTROLLO DELLA COLONNA
          t = 0;
          coord = matrice[elementoR][elementoC][2];    //coord contiene la coordinata binaria nella riga del punto di riferimento
          while (t < coord.length) {
            j = ner;
            flag = true;
            while (j < groups[i].length && groups[i][j].col === elementoC) {   //finchè gli elementi si trovano sulla stessa colonna
              if (coord.charAt(t) !== matrice[groups[i][j].riga][elementoC][2].charAt(t)) { //controlla i singoli caratteri delle coordinate binarie nelle righe degli elementi appartenenti al gruppo
                flag = false;                                     //se trova che i caratteri sono diversi, la variabile non viene considerata e si esce dal ciclo
                break;
              }
              j += ner;
            }
            if (flag) {                        //viene aggiornata la soluzione solo se i caratteri risultano tutti uguali
              if(tipoSol==="SOP")                 //forma SOP
              {
                if (coord.charAt(t) === "0") {
                  soluzione +=  "'" + alp[k];
                }
                else{
                  soluzione += alp[k];
                }
              }
              else{                               //forma POS
                if (coord.charAt(t) === "0") {
                  soluzione += alp[k];
                }
                else{
                  soluzione += "'" + alp[k];
                }
                soluzione += "+";
              }
            }
            k++;
            t++;
          }
          if(tipoSol==="POS")     //in forma POS si avrà un "+" a fine stringa e viene eliminato
          {
            soluzione=soluzione.substr(0,soluzione.length-1);
          }
          vettoreSol.push(soluzione);
          soluzione="";
        }
      }
  
      if (vettoreSol[0] === "" || !vettoreSol[0])   //se la soluzione è stringa vuota allora la matrice è formata da tutti 0 o da tutti 1
      {
        
        if (matrice[0][0][0] === 0) {
          vettoreSol[0]="0";
        }
        else {
          vettoreSol[0]="1";
        }
      }
      this.drawSolution(vettoreSol);
    }
  
    drawGroup(temp, groups) {
      let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  //array dei colori
      let c = -1; //usato per identificare i singoli div per il quale poi verranno eliminati, indica anche il colore da usare
      for (let i = 0; i < temp.length; i++) { //ciclo che scorre i gruppi
        if (temp[i].length > 0 && groups[i].length !== Math.pow(2, this.state.typeMap)) {
          c++;
          let j = 0;
          let FirstElCol = groups[i][0].col;
          let FirstElRig = groups[i][0].riga;
          while (j < groups[i].length) {                                    //ciclo che scorre gli elementi del singolo gruppo
            let element = $("#" + groups[i][j].riga + groups[i][j].col);    //recupero l'elemento

            if (element.attr('class') && $("#" + element.attr('id') + c)) { //se l'elemento è già stato disegnato
              element.after("<div id=" + element.attr('id') + c + "></div>"); //ne creo un altro subito dopo
              element = $("#" + groups[i][j].riga + groups[i][j].col + c);    //e lo recupero
            }
            //console.log(!element.attr('class'))
            element.css("border-color", color[c]);                            //settaggi css
            element.append("<div class='backgr' style='background-color: "+color[c]+"'></div>"); //metti dentro un div che colora lo sfondo del gruppo

            //Valutazione del tipo di elemento secondo quale celle del gruppo gli sono adiacenti e in quale posizione
            let destra = this.checkElInGroups(j, groups[i], "destra");
            let sotto = this.checkElInGroups(j, groups[i], "sotto");
            let sinistra = this.checkElInGroups(j, groups[i], "sinistra");
            let sopra = this.checkElInGroups(j, groups[i], "sopra");
  
          //  console.log("d: " + destra + " sin: " + sinistra + " sopra: " + sopra + " sotto: " + sotto);
            
          //valutazione dei casi per poi inserire il nome corretto di classe css che indica il tipo di raggruppamento da disegnare per quella cella
            if (destra) {
              if (sotto) {
                if (sinistra) {
                  if (groups[i][j].col === FirstElCol) element.addClass("TopLeft");
                  else if (j === ((groups[i].length / 2) - 1) || j === (groups[i].length - 1)) element.addClass("TopRig");
                  else element.addClass("top")
                }
                else if (sopra) {
                  if (j === groups[i].length - 2 || j === groups[i].length - 1) element.addClass("BotLeft");
                  else if (groups[i][j].riga === FirstElRig) element.addClass("TopLeft");
                  else element.addClass("left");
                }
                else  element.addClass("TopLeft");
              }
              else if (sopra) {
                if (sinistra) {
                  if (groups[i][j].col === FirstElCol) element.addClass("BotLeft");
                  else if (j === groups[i].length - 1 || j === (groups[i].length/2) - 1) element.addClass("BotRig");
                  else element.addClass("bot");
                }
                else element.addClass("BotLeft");
              }
              else if (sinistra) {
                if (j === 0) element.addClass("ClosedLeft")
                else if (j === groups[i].length - 1) element.addClass("ClosedRig");
                else element.addClass("top-bot");
              }
              else element.addClass("ClosedLeft");
            }
  
            else if (sopra) {
              if (sinistra) {
                if (sotto) {
                  if (groups[i][j].riga === FirstElRig) element.addClass("TopRig");
                  else if (j === groups[i].length - 1 || j === groups[i].length - 2) element.addClass("BotRig");
                  else element.addClass("right");
                }
                else element.addClass("BotRig");
              }
              else if (sotto) {
                if (j === 0) element.addClass("ClosedTop");
                else if (j === groups[i].length - 1) element.addClass("ClosedBot");
                else element.addClass("left-right");
              }
              else element.addClass("ClosedBot");
            }
  
            else if (sinistra) {
              if (sotto) element.addClass("TopRig");
              else element.addClass("ClosedRig");
            }
            else if (sotto) element.addClass("ClosedTop");
            else element.addClass("monoGroup");
            j++;
          }
        }
      }
    }
  
    checkElInGroups(j, groups, lato) { //restituisce in quale direzione esistono celle appartenenti allo stesso gruppo della cella da controllare (j identifica la cella nel gruppo)
      const matrix = this.state.squares;
      let r = matrix[0].length;
      let c = matrix[0].length;
      if (this.state.typeMap === 3) {
        r = 2;
        c = 4;
      }
      //for che controlla se le celle adiacenti fanno parte del gruppo o meno, settando opportunamente i flag
      for (let k = 0; k < groups.length; k++) {
        if (lato === "destra" && (groups[k].col === (groups[j].col + 1) % c && groups[k].riga === groups[j].riga % r))
          return true;
        if (lato === "sotto" && (groups[k].col === groups[j].col % c && groups[k].riga === (groups[j].riga + 1) % r))
          return true;
        if (lato === "sinistra") {
          let col = groups[j].col - 1;
          if (col < 0) col = c - 1;
          if ((groups[k].col === col % c && groups[k].riga === groups[j].riga % r))
            return true;
        }
        if (lato === "sopra") {
          let riga = groups[j].riga - 1;
          if (riga < 0) riga = r - 1;
          if ((groups[k].col === groups[j].col % c && groups[k].riga === riga % r))
            return true;
        }
      }
      return false;
    }
  
    drawSolution(vettoreSol){   //medodo che stampa a video la soluzione proposta
      $(".Solution").show();
  
      let costo=0; //costo dei letterali
      if(vettoreSol[0]==="0" || vettoreSol[0]==="1"){ //caso nel quale la matrice sia tutta 0 o tutta 1
        $("#sol").append("<div>"+ vettoreSol[0]+ "</div>");
      }
      else{
        const typeSol = this.state.typeSol;
        let s = (typeSol==="SOP")? "+":"·";   //inserisce il simbolo a seconda del tipo di risultato scelto
        let cls = (typeSol==="SOP")? "groupSop":"groupPos"; //stabilisce il css da utilizzare

        //array dei colori, uguale a quello dei gruppi disegnati in modo da identificare dal colore il gruppo corrispondente
        let color = ["red", "blue", "green", "orange", "#50C878","lightblue","#CD7F32","#ff6699"];  
  
        for(let i=0; i<vettoreSol.length; i++){ //scorre la soluzione, divisa in gruppi
          //inserisce un div del colore corrispondente al gruppo
          $("#sol").append("<div id='sol"+i+"' class='"+cls+"' style='background-color: "+color[i]+"'></div>");
          
          for(let j=0; j<vettoreSol[i].length; j++){ //scorre il singolo gruppo della soluzione

            if(vettoreSol[i][j]!=="'")
              $("#sol"+i).append(vettoreSol[i][j]+" "); //se non è presente ', stampa normalmente il valore
            else{
              //se presente, incrementa l'indice in modo da puntare alla lettera successiva, che verrà negata
              $("#sol"+i).append("<span style='text-decoration: overline'>"+vettoreSol[i][++j]+"</span> ");
            }
            if(vettoreSol[i][j]!=="+") costo++; //incrementa il costo dei letterali
          }
          if(i!==vettoreSol.length-1) $("#sol").append("<div class='plus'> "+s+" </div>"); //aggiunge il simbolo deciso ad inizio metodo, a seconda del tipo di sol scelto
        }
      }
      $("#costo").html("Literal Cost: "+costo); //stampa il costo dei letterali

      //pone la soluzione più o meno centralmente sotto la mappa, in modo da evitare che incrementando il numero di elementi, vada a rovinare il layout
      $(".Solution").css("left", parseInt($(".Solution").css("left"))-parseInt($(".Solution").css("width"))/2);
    }
  
    render() {
      //costanti che mantengono il valore delle variabili di stato
      const values = this.state.squares;
      const typeMap = this.state.typeMap;
      const perm = this.state.perm;
      const typeSol = this.state.typeSol;
      //Se non si mette ()=> nel bottone, ad ogni click sui quadrati, viene  richiamata la func
      let i = 0; //usata come key
      return (
        <div key={i++}>
            <div className="title"><h1> Karnaugh Map Solver </h1></div>
          <div className="bodyPage" key={i++}>
            <p className="nameTab"> Truth Table </p>
            <div className="truthTable" key={i++}>
              <TruthTable
                squares={values}
                typeMap={typeMap}
                perm={perm}
                key={i++}
                onClick={(i, j) => this.handleClick(i, j)}
                setRowOrColCell={(i, j, k, val) => this.setRowOrColCell(i, j, k, val)}
              />
            </div>
            <div className="kMap">
              <Map
                squares={values}
                typeMap={typeMap}
                onClick={(i, j) => this.handleClick(i, j)}
              />
            </div>
  
            <OptionButton
              squares={values}
              typeMap={typeMap}
              typeSol={typeSol}
              onClick={() => this.Algorithm(values)}
              setTypeSol={(val) => this.setTypeSol(val)}
              setMatrixSquare={(val) => this.setMatrixSquare(val)}
              setTypeMap={(val) => this.setTypeMap(val)}
            />
            <div className="Solution">
              <div>{typeSol} form:</div>
              <div className="sol" id="sol">  
              </div>
              <div id="costo"> 
                </div>
            </div>
          </div>
        </div>
      );
    }
  }
  
  function isPower(x, y) {
    if (x === 1)
      return (y === 1);
  
    var pow = 1;
    while (pow < y)
      pow *= x;
  
    return (pow === y);
  }