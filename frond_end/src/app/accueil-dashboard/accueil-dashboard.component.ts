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
  temp12:any
  temp8:any
  temp19:any
  temp!:any[]
  moyTemp:any;
  moyHum:any;
  dethier:any;
  temp20: any;
  temperature!:any;
  humidite!:any;
  tempDegres!:any;
  tempFara!:any;
  fara=273;
  capteur_gauche!:any;
  capteur_droite!:any;
  img:boolean =false
  t8:any;t12:any;t19:any;h8:any;h12:any;h19:any;
  constructor(private meteoservice:SocketService, private serServe :UsersService, private socket: Socket){}

  ngOnInit(): void {

     this.meteoservice.onFetch().subscribe((data)=>{
     // console.log(data);
    });

     this.meteoservice.valeur2().subscribe((data:any)=>{
      this.temperature = data;
     // console.log(this.temperature);
    });

    this.meteoservice.valeur1().subscribe((data:any)=>{
      this.humidite = data;
     // console.log(this.humidite);
    })
    
    this.meteoservice.valeur4().subscribe((data:any)=>{
      this.tempDegres = data;
     // console.log(this.tempDegres);
     });
      this.meteoservice.valeur3().subscribe((data:any)=>{
        this.tempFara = data;
       // console.log(this.tempFara);
      });
        this.meteoservice.valeur5().subscribe((data:any)=>{
          this.capteur_gauche = data;
        })
        this.meteoservice.valeur6().subscribe((data:any)=>{
          this.capteur_droite = data;
        })
    //recuperation temperature par heur données et calsul des moyenne 
    this.serServe.historique().subscribe((data)=>{
      //console.log(data);
     this.currentDate = new Date().getDate() + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear();
     this.dethier = new Date().getDate()-7 + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear();
    /*  console.log(this.dethier); */
     
     this.temphum = data as unknown as Temphum[];
     console.log(this.temphum);
     
     this.temp8 = this.temphum.filter((e:any)=> e.Heure == "14:31:00" && e.Date == this.currentDate)
     this.temp12 = this.temphum.filter((e:any)=> e.Heure == "12:00:00" && e.Date == this.currentDate)
     this.temp19 = this.temphum.filter((e:any)=> e.Heure == "19:00:00" && e.Date == this.currentDate)
     this.temp20 = this.temphum.filter((e:any)=> e.Heure == "19:00:00" || "12:00:00" || "08:00:00" && e.Date == this.dethier && e.Date <= this.currentDate)
    /*  console.log(this.temp20);
      */
   /*   this.temp20.forEach(function (temperature:any) {
      console.log(temperature.temperature);
    });  */


  /*   const t8 = this.temp8[0].temperature;
    const h8 = this.temp8[0].humidite;
    const t12 = this.temp12[0].temperature;
    const h12 = this.temp12[0].humidite;
    const t19 = this.temp19[0].temperature;
    const h19 = this.temp19[0].humidite;

    this.moyTemp = (parseInt(String(this.t8)) + parseInt(String(this.t12)) + parseInt(String(this.t19))) / 3;
    this.moyHum = (parseInt(String(this.h8)) + parseInt(String(this.h12)) + parseInt(String(this.h19))) / 3; */
    
    })  
  }

RotationPlus(){
  this.meteoservice.RotationPlus();
}
RotationMoin(){
  this.meteoservice.RotationMoin();
}
  }
