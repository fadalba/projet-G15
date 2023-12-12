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
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 12:00 PM',
          data: temperaturesAt12AM,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Adjust color as needed
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 7:00 PM',
          data: temperaturesAt7AM,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 205, 86, 1)', // Adjust color as needed
          borderWidth: 3,
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

//courbe pour l'humidité
 // Your existing chart initialization code
 if (this.temp8.length > 0 && this.temp12.length > 0 && this.temp19.length > 0) {
  const humiditeAt8AM = this.temp8.map((e: any) => e.humidite);
  const humiditeAt12AM = this.temp12.map((e: any) => e.humidite);
  const humiditeAt7AM = this.temp19.map((e: any) => e.humidite);
  const DateTotal = this.temp8.map((e: any) => e.Date);

  const ctx = document.getElementById('humiditeChart') as HTMLCanvasElement;
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DateTotal,
      datasets: [
        {
          label: 'Humidite at 8:00 AM',
          data: humiditeAt8AM,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3,
        },
        {
          label: 'Humidite at 12:00 PM',
          data: humiditeAt12AM,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Adjust color as needed
          borderWidth: 3,
        },
        {
          label: 'Humidite at 7:00 PM',
          data: humiditeAt7AM,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 205, 86, 1)', // Adjust color as needed
          borderWidth: 3,
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
}
// Your existing chart initialization code
if (this.temp8.length > 0 && this.temp12.length > 0 && this.temp19.length > 0) {
  const temperatures_THCAt8AM = this.temp8.map((e: any) => e.temperature_THC_C);
  const temperatures_THCAt12AM = this.temp12.map((e: any) => e.temperature_THC_C);
  const temperatures_THCAt7AM = this.temp19.map((e: any) => e.temperature_THC_C);

 
  const DateTotal = this.temp8.map((e: any) => e.Date);

  const ctx = document.getElementById('ThermocoupleChart') as HTMLCanvasElement;
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DateTotal,
      datasets: [
        {
          label: 'Temperatures at 8:00 AM',
          data: temperatures_THCAt8AM,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 12:00 PM',
          data: temperatures_THCAt12AM,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Adjust color as needed
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 7:00 PM',
          data: temperatures_THCAt7AM,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 205, 86, 1)', // Adjust color as needed
          borderWidth: 3,
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
// Your existing chart initialization code
if (this.temp8.length > 0 && this.temp12.length > 0 && this.temp19.length > 0) {
  const temperatures_THCAt8AM = this.temp8.map((e: any) => e.temperature_THC_F);
  const temperatures_THCAt12AM = this.temp12.map((e: any) => e.temperature_THC_F);
  const temperatures_THCAt7AM = this.temp19.map((e: any) => e.temperature_THC_F);

 
  const DateTotal = this.temp8.map((e: any) => e.Date);

  const ctx = document.getElementById('Thermocouple_F_Chart') as HTMLCanvasElement;
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DateTotal,
      datasets: [
        {
          label: 'Temperatures at 8:00 AM',
          data: temperatures_THCAt8AM,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 12:00 PM',
          data: temperatures_THCAt12AM,
          backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 99, 132, 1)', // Adjust color as needed
          borderWidth: 3,
        },
        {
          label: 'Temperatures at 7:00 PM',
          data: temperatures_THCAt7AM,
          backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust color as needed
          borderColor: 'rgba(255, 205, 86, 1)', // Adjust color as needed
          borderWidth: 3,
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

  
                     
    
            
            
       
      }); 

  
  
  }
   
  
     
  }
    
  