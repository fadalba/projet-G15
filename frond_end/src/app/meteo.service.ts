import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Socket } from 'ngx-socket-io';
import { Temp_Humid } from './services/interfaces/movie';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class SocketService {
	private url = 'http://localhost:3001/api/g15';
  data: any[] = [];
  httpClient: any;
	constructor(private socket: Socket, private http: HttpClient) { }

	// emit event
	allume() {
		this.socket.emit('active', '1');
	}

	addMovie(TeHu: Temp_Humid) {
		this.socket.emit('addMovie', TeHu);
	}

	updateMovie(TeHu: Temp_Humid) {
		this.socket.emit('updateMovie', TeHu);
	}

	deleteMovie(id: Temp_Humid) {
		this.socket.emit('deleteMovie', id);
	}

	// listen event
	onFetch() {
		return this.socket.fromEvent('data');
	}
	getTotal(){
		return this.http.get<any[]>(this.url);
	}
	onFetchitem() {
		return this.socket.fromEvent('mute');
	}
	
	valeur2(){
		return this.socket.fromEvent('valeur2')
	  }
	  valeur1(){
		return this.socket.fromEvent('valeur1')
	  }
	  	
	valeur3(){
		return this.socket.fromEvent('valeur3')
	  }
	  valeur4(){
		return this.socket.fromEvent('valeur4')
	  }
	  valeur5(){
		return this.socket.fromEvent('valeur5')
	  }
	  valeur6(){
		return this.socket.fromEvent('valeur6')
	  }
	  RotationPlus(){
		this.socket.emit('RotationPlus' , '1')
	  }
	  RotationMoin(){
		this.socket.emit('RotationMoin', '2')
	  }
}
