import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { InitMapService } from '../init-map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {  
  private map!: L.Map;

  constructor(public mapService: InitMapService) { }

  ngAfterViewInit(): void {
    this.mapService.initMap(this.map);
  }

}
