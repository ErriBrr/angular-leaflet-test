import { Injectable } from '@angular/core';
import { CONTINENTS } from './continents';
import { USACapitalsFeature, GeoJsonFeatures, USAStatesFeature, EuropeanStatesFeature } from './feature';
import { FeaturesDataService } from './features-data.service';
import { MapControllerService } from './map-controller.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private usaCapitals!: USACapitalsFeature[];

  constructor(
    private mapController: MapControllerService,
    private featureService: FeaturesDataService
  ) {}

  initStatesLayer() {
    this.featureService.usaCapitals.subscribe((c:any) => {
      this.usaCapitals = c.features;
      this.featureService.usaStates.subscribe((data:any) => {
        const states: USAStatesFeature[] = data.features;
        states.forEach(x => {
          const latLng = this.getLatLonByName(x.properties.NAME);
          if (latLng) {
            x.properties.center = latLng;
          }
        });
        const geoJson: GeoJsonFeatures = {
          type: "FeatureCollection",
          features: states
        };
        this.mapController.addStatesLayer(geoJson, CONTINENTS.a);
      });
    });
    this.featureService.euroStates.subscribe((data:any) => {
      const states: EuropeanStatesFeature[] = data.features;
      states.forEach(x => {
        x.properties.center = [x.properties.LAT, x.properties.LON];
      });
      const geoJson: GeoJsonFeatures = {
        type: "FeatureCollection",
        features: states
      };
      this.mapController.addStatesLayer(geoJson, CONTINENTS.e);
    });
  }

  private filterByName(name: string): any {
    const state = this.usaCapitals.filter(c => c.properties.state === name);
    return state[0];
  }

  getLatLonByName(name: string): number[] | null {
    const state = this.filterByName(name);
    if (state) {
      return [state.geometry.coordinates[1], state.geometry.coordinates[0]];
    } else {
      return null
    }
  }
}
