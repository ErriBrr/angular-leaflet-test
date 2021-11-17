import { Injectable } from '@angular/core';
import { CapitalsFeature, GeoJsonFeatures, StatesFeature } from './feature';
import { MapControllerService } from './map-controller.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private capitals!: CapitalsFeature[];

  constructor(private mapController: MapControllerService) {}

  initStatesLayer(capitals: CapitalsFeature[], states: StatesFeature[]) {
    this.capitals = capitals;
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
    this.mapController.addStatesLayer(geoJson);
  }

  private filterByName(name: string): any {
    const state = this.capitals.filter(c => c.properties.state === name);
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
