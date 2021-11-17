import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import * as L from 'leaflet';
import { GeoJsonFeatures } from './feature';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  map!: L.Map;
  markers: L.Marker[] = [];
  circles: L.CircleMarker[] = [];
  layers: L.Layer[] = [];

  constructor(private popupService: PopupService) {}

  addMarker(lat:number, lon:number) {
    const marker = L.marker([lat, lon]);
    marker.addTo(this.map);
    this.markers.push(marker);
  }

  addCircle(lat:number, lon:number, properties:any, radius:number) {
    const circle = L.circleMarker([lat, lon], {
      radius: radius
    });
    circle.bindPopup(this.popupService.makeCapitalPopup(properties));
    circle.addTo(this.map);
    this.circles.push(circle);
  }

  addStatesLayer(geoJson: GeoJsonFeatures) {
    const stateLayer = L.geoJSON(geoJson, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          click: (e) => (this.map.setView(new L.LatLng(feature.properties.center[0], feature.properties.center[1]),8))
        })
      }
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
    this.layers.push(stateLayer);
  }

  highlightFeature(e: any) {
    e.target.setStyle({
      weight: 10,
      opacity: 0.5,
      color: '#DFA612',
      fillOpacity: 0.8,
      fillColor: '#FAE042'
    });
  }
  
  resetFeature(e: any) {
    e.target.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }
}
