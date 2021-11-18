import { Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { ShapeService } from './shape.service';
import { FeaturesDataService } from './features-data.service';
import * as L from 'leaflet';
import { MapControllerService } from './map-controller.service';

@Injectable({
  providedIn: 'root'
})
export class InitMapService {
  private urlTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  constructor(
    private markerService: MarkerService,
    private shapeService: ShapeService,
    private mapController: MapControllerService
  ) {}

  public initMap() {
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

    this.mapController.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    L.tileLayer(this.urlTiles, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.mapController.map);

    this.markerService.makeCapitalCircleMarkers();
    this.shapeService.initStatesLayer();
  }
}
