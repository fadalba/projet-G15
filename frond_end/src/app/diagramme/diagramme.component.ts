import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { UsersService } from '../services/users.service';
import { Temphum } from '../models/temphum';
import { NgChartsModule } from 'ng2-charts';
import { SocketService } from '../meteo.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register the required date adapter
Chart.register(...registerables);

@Component({
  selector: 'app-diagramme',
  templateUrl: './diagramme.component.html',
  styleUrls: ['./diagramme.component.css']
})
export class DiagrammeComponent implements OnInit {
  chart: any;
  temphum! : Temphum [];
  temp! :any [];
  currentDate!: any;
  temp8: any;
  temp12: any;
  temp19: any;
  moyTemp!: number;
  moyHum!: number;
  dethier1!: string;
  allTemphum: Temphum[] = [];


  

  constructor(private weather: SocketService  ) {}
  
  ngOnInit(): void {

//     const xValues = [100,200,300,400,500,600,700,800,900,1000];

// new Chart("myChart", {
//   type: "line",
//   data: {
//     labels: xValues,
//     datasets: [{
//       data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
//       borderColor: "red",
//       fill: false
//     },{
//       data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
//       borderColor: "green",
//       fill: false
//     },{
//       data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
//       borderColor: "blue",
//       fill: false
//     }]
//   },
//   // options: {
//   //   legend: {display: false}
//   // }
// });

    /* Fonction pour la recuperation des données humidité et temperature */
    this.weather.getTotal().subscribe((data)=>{
     // console.log(data);
     this.currentDate = new Date().getDate() + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear();// recuperation date actuelle
     this.dethier1 = new Date().getDate()-7 + '/' + new Date().getMonth() +1 + '/'+  new Date().getFullYear(); // recuperation date du semaine derniere
  
    this.temphum = data as unknown as Temphum[];
     this.allTemphum = [...this.temphum]; // Copie les données dans la nouvelle propriété
     //console.log(this.allTemphum);
     
    //  this.temp8 = this.temphum.filter((e:any)=> e.Heure == "08:00:00")
    //  this.temp12 = this.temphum.filter((e:any)=> e.Heure == "12:00:00" )
    //  this.temp19 = this.temphum.filter((e:any)=> e.Heure == "19:00:00" && e.Date == this.currentDate)
  // Filter data for 8:00 AM
  this.temp8 = this.temphum.filter((e: any) => e.Heure === "08:00:00");
  this.temp12 = this.temphum.filter((e: any) => e.Heure === "12:00:00");
  this.temp19 = this.temphum.filter((e: any) => e.Heure === "19:00:00");



  // if (this.temp8.length > 0) {
  //   // Extract temperatures for all dates at 8:00 AM
  //   const temperaturesAt8AM = this.temp8.map((e: any) => e.temperature);
  //   const temperaturesAt12AM = this.temp12.map((e: any) => e.temperature);
  //   const temperaturesAt19AM = this.temp19.map((e: any) => e.temperature);

  //   // Extract temperatures for all dates at 8:00 AM
  //   const DateAt8AM = this.temp8.map((e: any) => e.Date);
  //   const DateAt12AM = this.temp12.map((e: any) => e.Date);
  //   const DateAt19AM = this.temp19.map((e: any) => e.Date);

  //   // You can use temperaturesAt8AM array as needed, for example:
  //   console.log("Temperatures at 8:00 AM for all dates:", temperaturesAt8AM);
  //   console.log("Temperatures at 12:00 AM for all dates:", temperaturesAt12AM);
  //   console.log("Temperatures at 19:00 AM for all dates:", temperaturesAt19AM);

  //   // You can use temperaturesAt8AM array as needed, for example:
  //   console.log("Temperatures at 8:00 AM for all dates:", DateAt8AM);
  //   console.log("Temperatures at 12:00 AM for all dates:",DateAt12AM);
  //   console.log("Temperatures at 19:00 AM for all dates:", DateAt19AM);
  //   // Calculate average temperature
  //   this.moyTemp = temperaturesAt8AM.reduce((acc: any, temp: any) => acc + temp, 0) / temperaturesAt8AM.length;
  // } else {
  //   // Handle the case when no data is available at 8:00 AM
  //   this.moyTemp = 0;
  // }

    


// Your existing chart initialization code
if (this.temp8.length > 0 && this.temp12.length > 0 && this.temp19.length > 0) {
  const temperaturesAt8AM = this.temp8.map((e: any) => e.temperature);
  const temperaturesAt12AM = this.temp12.map((e: any) => e.temperature);
  
  const temperaturesAt7AM = this.temp19.map((e: any) => e.temperature);

  const DateTotal = this.temp8.map((e: any) => e.Date);

  const ctx = document.getElementById('temperatureChart') as HTMLCanvasElement;
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DateTotal,
      datasets: [
        {
          label: 'Temperatures at 8:00 AM',
          data: temperaturesAt8AM,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Temperatures at 12:00 PM',
          data: temperaturesAt12AM,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Adjust color as needed
          borderWidth: 1,
        },
        {
          label: 'Temperatures at 7:00 PM',
          data: temperaturesAt7AM,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 205, 86, 1)', // Adjust color as needed
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        xAxis: {
          type: 'time',
          time: {
            unit: 'day',
          },
        },
        yAxis: {
          beginAtZero: true,
        },
      },
    },
  });
} else {
  this.moyTemp = 0;
}


  
                     
           
  this.chart = new Chart('canvas', {
    type: 'bar',
    data: {
      labels: [ "8h", "12h", "19h" ],
      datasets: [
        {
           label: "Temperature",
          data: this.temp8[0].temperature,
          backgroundColor: '#F53727'
        },
        {
          label: "Humidité",
          data: this.temp8[0].humidite,
          backgroundColor: '#69AEF7'
         /*  */
        },
      ]
    },
   
  })     
            
            
       
      }); 

  
  
  }
   
  
     
  }
    
  