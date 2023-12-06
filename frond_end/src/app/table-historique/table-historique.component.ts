import { data } from 'jquery';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Temphum } from '../models/temphum'; 
import { io } from 'socket.io-client';

import { Temp_Humid } from '../services/interfaces/movie';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from '../services/users.service';
import { SocketService } from '../meteo.service';
import jsPDF from 'jspdf'; // importation de package pour le pdf
import html2canvas from 'html2canvas'; // importation de package pour le pdf


@Component({
  selector: 'app-table-historique',
  templateUrl: './table-historique.component.html',
  styleUrls: ['./table-historique.component.css']
})
export class TableHistoriqueComponent implements OnInit{
  @ViewChild('htmlData') htmlData!: ElementRef; // pour le téléchargement en pdf
 /* Declaration des variables */
 temphum!: Temphum[] ;
 temp! :any [];
 currentDate!: any;
 temp8: any;
 temp12: any;
 temp19: any;
 temp20: any;
 dethier1: any;
 dethierr: any;
 moyTemp!: number;
 moyHum!: number;
searchText!: string;
itemsperpage: number =5;
p: number = 1;
show:boolean = false;
  historique!: Temphum[];
  donne8h!:any;
  donne12h!: Temphum[];
  allTemphum: Temphum[] = [];



constructor(private meteoservice:SocketService, private serServe :UsersService){}
ngOnInit()  {
   
/* Fonction pour la recuperation des données humidité et temperature */
    this.meteoservice.getTotal().subscribe((data)=>{
      //console.log(data);
     this.currentDate = new Date().getDate() + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear();// recuperation date actuelle
     this.dethier1 = new Date().getDate()-7 + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear(); // recuperation date du semaine derniere
  
    this.temphum = data as unknown as Temphum[];
     this.allTemphum = [...this.temphum]; // Copie les données dans la nouvelle propriété
     this.temp8 = this.temphum.filter((e:any)=> e.Heure == "08:00:00" && e.Date == this.currentDate)
     this.temp12 = this.temphum.filter((e:any)=> e.Heure == "12:00:00" && e.Date == this.currentDate)
     this.temp19 = this.temphum.filter((e:any)=> e.Heure == "19:00:00" && e.Date == this.currentDate)
     console.log(this.temphum); 
     
    /*  this.temp20.forEach(function (temperature:any) {
      console.log(temperature.temperature);
    });  */

    const t8 = this.temp8[0].temperature;
    const h8 = this.temp8[0].humidite;
    const t12 = this.temp12[0].temperature;
    const h12 = this.temp12[0].humidite;
    const t19 = this.temp19[0].temperature;
    const h19 = this.temp19[0].humidite;
    /* calcul de la temperature et de l'humidité moyenne */ 
    this.moyTemp = (parseInt(String(t8)) + parseInt(String(t12)) + parseInt(String(t19))) / 3;
    this.moyHum = (parseInt(String(h8)) + parseInt(String(h12)) + parseInt(String(h19))) / 3;
    
    })  ;
 
  }

  public openPDF(): void {
    const title = 'Rapport climatographique du :';
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      const position = 20; // position de déclage  aven haut du tableau
      
   // Ajouter l'image
   const logo = new Image();
    logo.src = './assets/panneau.png';
   logo.onload = function() {
     PDF.addImage(logo, 'PNG', 2, 2, 15, 15);
  
  
      // Ajouter l'en-tête avec le titre et la date
      PDF.text(title, 24, 10);//position X, Y
      PDF.text(new Date().toLocaleString(), 120, 10);
  
      
  
      // Ajouter l'image
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  
      
  
      // Enregistrer le document PDF
      PDF.save('rapport du système.pdf');
   }
    });
  }
  
  /* *****************************************************Téléchargement en pdf ******************/


  public afficher():void{
    this.show = !this.show;
  }
}




