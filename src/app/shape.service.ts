import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from './marker.service';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {
  constructor(private http: HttpClient, private markerService: MarkerService) { }

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

  initStatesLayer(map: L.Map, states: any) {
    const stateLayer = L.geoJSON(states, {
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
          click: (e) => (map.setView(this.getLatLon(feature.properties.NAME),8))
        })
      )
    });

    map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  getStateShapes() {
    return this.http.get('/assets/data/gz_2010_us_040_00_5m.json');
  }

  private filterByName(name: string): any {
    const states = this.markerService.getCapitals();
    const state = states.filter((state: { properties: { state: string; }; }) => state.properties.state === name);
    return state[0];
  }

  private getLatLon(name: string): L.LatLng {
    const state = this.filterByName(name);
    return new L.LatLng(state.geometry.coordinates[1], state.geometry.coordinates[0]);
  }
}
