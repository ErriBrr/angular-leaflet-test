import { Injectable } from '@angular/core';
import { CapitalsFeature } from './feature';
import { MapControllerService } from './map-controller.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private mapController: MapControllerService) {}

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeCapitalMarkers(capitals: CapitalsFeature[]): void {
    capitals.forEach(c => {
      const lon = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      this.mapController.addMarker(lat, lon);
    })
  }

  makeCapitalCircleMarkers(capitals: CapitalsFeature[]): void {
    const maxPop = Math.max(...capitals.map(x => x.properties.population), 0);
    capitals.forEach(c => {
      console.log(c);
      const lon = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      this.mapController.addCircle(lat, lon, c.properties, MarkerService.scaledRadius(c.properties.population, maxPop))
    });
  }
}
