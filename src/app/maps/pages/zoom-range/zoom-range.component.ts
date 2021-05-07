import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';  // npm i --save-dev @types/mapbox-gl

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .map-container {
      width: 100%;
      height: 100%;
    }

    .row {
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 999;
      width: 400px;
    }
    `    
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('map') divMap!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-100.97374266994598, 25.412621037903847];

  constructor() {}

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
  }

  ngAfterViewInit(): void {

    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if (this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    });

    //move of map
    this.map.on('move', (ev) => {
      const target = ev.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat];
    });

  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomChange(value: string) {
    this.map.zoomTo(+value);
  }

}
