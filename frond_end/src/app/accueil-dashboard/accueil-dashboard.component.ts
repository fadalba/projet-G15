import { data } from 'jquery';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../meteo.service';
import { UsersService } from '../services/users.service';
import { Temphum } from '../models/temphum'; 
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-accueil-dashboard',
  templateUrl: './accueil-dashboard.component.html',
  styleUrls: ['./accueil-dashboard.component.css']
})
export class AccueilDashboardComponent implements OnInit {
  currentDate:any;
  tempHum: any = []
  temphum!: Temphum[] ;
  temp12_dht:any
  temp8_dht:any
  temp19_dht:any
  temp!:any[]
  moyTemp:any;
  moyHum:any;
  dethier:any;
  temp20: any;
  humidite!:any;
  tempDegres!:any;
  tempFara!:any;
  fara=273;
  capteur_gauche!:any;
  capteur_droite!:any;
  position!:any;
  img:boolean =false
  t8:any;t12:any;t19:any;h8:any;h12:any;h19:any;
  historique!: Temphum[];
  last_week!: string;
  date: any;
  donne8h!: Temphum[];
  donne12h!: Temphum[];
  donne19h!: Temphum[];
  donneesEnJSON!: any;
  affiche!:any
  showMessage!: boolean;
  Pos1!: number;

  constructor(private meteoservice:SocketService, private serServe :UsersService, private socket: Socket){}

//fonction de lecture vocale
lireMessageVocal(message: string) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(message);
  synth.speak(utterance);
}
/* ********************fin Fonction pour lire un message vocal******************** */
afficherMessageA() {
this.showMessage = true;
this.lireMessageVocal("Rotation en cours."); // syntèse vocal

}
  ngOnInit(): void {


     this.meteoservice.valeur2().subscribe((data:any)=>{
      this.temp = data;
     console.log(this.temp);
    });

    this.meteoservice.valeur1().subscribe((data:any)=>{
      this.humidite = data;
     // console.log(this.humidite);
    })
    
    this.meteoservice.valeur4().subscribe((data:any)=>{
      this.tempFara = data;
     // console.log(this.tempDegres);
     });
      this.meteoservice.valeur3().subscribe((data:any)=>{
        this.tempDegres = data;
       // console.log(this.tempFara);
      });
        this.meteoservice.valeur5().subscribe((data:any)=>{
          this.capteur_gauche = data;
        })
        this.meteoservice.valeur6().subscribe((data:any)=>{
          this.capteur_droite = data;
        })
        this.meteoservice.valeur7().subscribe((data:any)=>{   
          this.position = data;
          console.log(this.position);
          if ( this.position == 3 ) {
            this.Pos1 = 0;
        }
        else if (this.position == 0) {
          this.Pos1 = 60;
      } else if (this.position == -1) {
            this.Pos1 = 40;
        }else if (this.position == 1) {
          this.Pos1 = 90;
      }else if (this.position == 2) {
        this.Pos1 = 120;
    }
          
        })

this.date = new Date(); // date
var jour= this.date.getDate(); //renvoie le chiffre du jour du mois
var mois = this.date.getMonth() + 1; //le mois en chiffre
var annee = this.date.getFullYear(); // me renvoie en chiffre l'annee
if (mois < 10) { mois = '0' + mois; } // si le jour est <10 on affiche 0 devant
if (jour < 10) { jour = '0' + jour; } // si le mois est <10 on affiche 0 devant


    this.meteoservice.getTotal().subscribe((data) => {
      // affichage de la journée
      //this.currentDate = ('0'+new Date().getDate()) + '-' + ((new Date().getMonth()+1)) + '-'+  new Date().getFullYear();
      this.currentDate = (new Date().getFullYear()) + '-' + ((new Date().getMonth()+1)) + '-'+  new Date().getDate();

    console.log(this.currentDate);
      
this.historique=data as unknown as Temphum[];

this.donne8h= this.historique.filter((h:any)=>h.Heure=='08:00:00'&& h.Date==this.currentDate)
console.log(this.donne8h)
 this.donne12h= this.historique.filter((h:any)=>h.Heure=='12:00:00' && h.Date==this.currentDate)
 //console.log(this.donne12h);
this.donne19h= this.historique.filter((h:any)=>h.Heure=='19:00:00' && h.Date==this.currentDate)

  });
  }

  RotationPlus(){
    this.meteoservice.RotationPlus();
  }
  RotationMoin(){
    this.meteoservice.RotationMoin();
  }
}
