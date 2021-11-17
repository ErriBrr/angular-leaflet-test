import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { PopupService } from './popup.service';
import { FeaturesDataService } from './features-data.service';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private popupService: PopupService,
    private featureService: FeaturesDataService,
    private shapeService: ShapeService
  ) { }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(map: L.Map): void {
    this.featureService.getCapitals().subscribe({
      next: (v) => {
        v.forEach(c => {
          const lon = c.geometry.coordinates[0];
          const lat = c.geometry.coordinates[1];
          const marker = L.marker([lat, lon]);
          marker.addTo(map);
        })
      }
    });
  }

  makeCapitalCircleMarkers(map: L.Map): void {
    this.featureService.getCapitals().subscribe({
      next: (capitals) => {
          const maxPop = Math.max(...capitals.map(x => x.properties.population), 0);
          capitals.forEach(c => {
            const lon = c.geometry.coordinates[0];
            const lat = c.geometry.coordinates[1];
            const circle = L.circleMarker([lat, lon], {
              radius: MarkerService.scaledRadius(c.properties.population, maxPop)
            });
            circle.bindPopup(this.popupService.makeCapitalPopup(c.properties));
            circle.addTo(map);
          this.shapeService.initStatesLayer(map, capitals);
        });
      }
    });
  }
}
