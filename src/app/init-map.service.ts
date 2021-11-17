import { Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import * as L from 'leaflet';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})
export class InitMapService {
  private urlTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  constructor(
    private markerService: MarkerService,
    private shapeService: ShapeService
  ) { }

  public initMap(map : L.Map ) {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    L.tileLayer(this.urlTiles, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    this.markerService.makeCapitalCircleMarkers(map);
    this.shapeService.getStateShapes().subscribe(states => {
      this.shapeService.initStatesLayer(map, states);
    });
  }
}
