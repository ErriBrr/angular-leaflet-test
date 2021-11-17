import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class ShapeService {

  constructor(private http: HttpClient) { }

  private highlightFeature(e: any) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042'
    });
  }
  
  private resetFeature(e: any) {
    const layer = e.target;
  
    layer.setStyle({
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
        })
      )
    });

    map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }

  getStateShapes() {
    return this.http.get('/assets/data/gz_2010_us_040_00_5m.json');
  }
}
