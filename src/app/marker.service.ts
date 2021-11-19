import { Injectable } from '@angular/core';
import { USACapitalsFeature, EuropeanCapitalsFeature } from './feature';
import { FeaturesDataService } from './features-data.service';
import { MapControllerService } from './map-controller.service';
import { CONTINENTS } from './continents';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(
    private mapController: MapControllerService,
    private featureService: FeaturesDataService
  ) {}

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  init(): void {
    this.featureService.usaCapitals.subscribe((data:any) => {
      const capitals: USACapitalsFeature[] = data.features;
      this.makeCapitalCircleMarkers(capitals, CONTINENTS.a);
    });
    this.featureService.euroCapitals.subscribe((data:any) => {
      const capitals: EuropeanCapitalsFeature[] = data.features;
      this.makeCapitalMarkers(capitals, CONTINENTS.e);
    });
  }

  makeCapitalMarkers(capitals: USACapitalsFeature[] | EuropeanCapitalsFeature[], continent: string): void {
    capitals.forEach(c => {
      const lon = c.geometry.coordinates[0];
      const lat = c.geometry.coordinates[1];
      this.mapController.addMarker(lat, lon, continent);
    })
  }

  makeCapitalCircleMarkers(usaCapitals: USACapitalsFeature[], continent: string ): void {
    if (usaCapitals) {
      const maxPop = Math.max(...usaCapitals.map(x => x.properties.population), 0);
      usaCapitals.forEach(c => {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        this.mapController.addCircle(lat, lon, c.properties, MarkerService.scaledRadius(c.properties.population, maxPop), continent)
      });
    }
  }
}
