import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { CapitalsFeature, GeoJsonFeatures, StatesFeature } from './feature';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  private capitals!: CapitalsFeature[];

  constructor() {}

  private highlightFeature(e: any) {
    e.target.setStyle({
      weight: 10,
      opacity: 0.5,
      color: '#DFA612',
      fillOpacity: 0.8,
      fillColor: '#FAE042'
    });
  }
  
  private resetFeature(e: any) {
    e.target.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  initStatesLayer(map: L.Map, capitals: CapitalsFeature[], states: StatesFeature[]) {
    this.capitals = capitals;
    const geoJson: GeoJsonFeatures = {
      type: "FeatureCollection",
      features: states
    };
    this.setStatesLayer(map, geoJson);
  }

  setStatesLayer(map: L.Map, geoJson: GeoJsonFeatures) {
    const stateLayer = L.geoJSON(geoJson, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          click: (e) => (map.setView(this.getLatLonByName(feature.properties.NAME),8))
        })
      )
    });

    map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  private filterByName(name: string): any {
    const state = this.capitals.filter(c => c.properties.state === name);
    return state[0];
  }

  private getLatLonByName(name: string): L.LatLng {
    const state = this.filterByName(name);
    return new L.LatLng(state.geometry.coordinates[1], state.geometry.coordinates[0]);
  }
}
