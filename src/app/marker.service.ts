import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopupService } from './popup.service';
import { CapitalsFeature } from './feature';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private popupService: PopupService
  ) {}

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(map: L.Map, capitals: CapitalsFeature[]): void {
    capitals.forEach(c => {
      const lon = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      const marker = L.marker([lat, lon]);
      marker.addTo(map);
    })
  }

  makeCapitalCircleMarkers(map: L.Map, capitals: CapitalsFeature[]): void {
    const maxPop = Math.max(...capitals.map(x => x.properties.population), 0);
    capitals.forEach(c => {
      console.log(c);
      const lon = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      const circle = L.circleMarker([lat, lon], {
        radius: MarkerService.scaledRadius(c.properties.population, maxPop)
      });
      circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
      circle.addTo(map);
    });
  }
}
