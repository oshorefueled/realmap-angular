import { Component, OnInit } from '@angular/core';
import * as Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';

declare var google:any;
declare var Pusher:Pusher;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  data : any;
  map : any;
  lat : number = 9.0820;
  long : number = 8.6753;
  marker : any;
  lineCoordinates = [];

  ngOnInit() {
    //map subscribes to channel on component initialization
    this.subscribe();
    //map is launched with default coordinates
    this.launchMap(this.lat, this.long);
  }


  subscribe(){
    var echo = new Echo({
      broadcaster: 'pusher',
      key: 'YOUR-KEY-HERE'
    });
    echo.channel('location')
      .listen('SendLocation', (e)=>{
         this.data = e.location;
          //map is updated on coordinate change
          this.updateMap(this.data);
      });
  }

  launchMap(lat, lng){
    var nigeria= {lat: lat, lng: lng};
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: nigeria
    });
    this.marker = new google.maps.Marker({
      map: this.map,
      animation:"bounce",
    });
    this.lineCoordinates.push(new google.maps.LatLng(this.lat, this.long));
  }

  updateMap(data){
    this.lat = parseFloat(data.lat);
    this.long = parseFloat(data.long);

    this.map.setCenter({lat:this.lat, lng:this.long, alt:0});
    this.marker.setPosition({lat:this.lat, lng:this.long, alt:0});

    this.lineCoordinates.push(new google.maps.LatLng(this.lat, this.long));

    new google.maps.Polyline({
      path: this.lineCoordinates,
      geodesic: true,
      map: this.map,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

  }

}
