import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: mapboxgl.Marker,
  centro?: [number, number]
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [`
    .map-container {
      width: 100%;
      height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
  `
  ]
})
export class MarkersComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [-100.97374266994598, 25.412621037903847];

  //Array of markers
  markers: MarkerColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

    this.readLocalStorage();
      
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hello World';

    // const marker = new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat(this.center)
    //   .addTo(this.map);


    // new mapboxgl.Marker()
    //   .setLngLat(this.center)
    //   .addTo(this.map);

  }

  goMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat()
    });
  }

  addMarker() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.map )
   
    this.markers.push({
      color,
      marker: newMarker
    });

    this.saveMarkersLocalStorage();

    newMarker.on('dragend', () => {
      this.saveMarkersLocalStorage();
    })
  }

  saveMarkersLocalStorage() {
    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach(m=>{
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      
      lngLatArr.push({
        color,
        centro: [lng, lat]
      });
    })

    localStorage.setItem('markers', JSON.stringify(lngLatArr));

  }

  readLocalStorage() {
    const markersLS = localStorage.getItem('markers');
    if (!markersLS) {
      return;
    }
    const lngLatArr:MarkerColor[] = JSON.parse(markersLS)!;
    
    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.centro!)
        .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveMarkersLocalStorage();
      });

    });
  }

  deleteMarker(i: number) {
    
    this.markers[i].marker?.remove();
    this.markers.splice(i,1);
    this.saveMarkersLocalStorage();
  }

}
