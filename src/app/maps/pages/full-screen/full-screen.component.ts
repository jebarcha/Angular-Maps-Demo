import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';  // npm i --save-dev @types/mapbox-gl

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
    #map {
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    

    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [ -100.97374266994598, 25.412621037903847 ],
    zoom: 14
    });

  }

}
