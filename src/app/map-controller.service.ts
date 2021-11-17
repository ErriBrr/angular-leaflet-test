import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import * as L from 'leaflet';
import { GeoJsonFeatures } from './feature';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  map!: L.Map;

  constructor(
    private popupService: PopupService, 
    private shapeService: ShapeService
  ) {}

  addMarker(lat:number, lon:number) {
    const marker = L.marker([lat, lon]);
    marker.addTo(this.map);
  }

  addCircle(lat:number, lon:number, properties:any, radius:number) {
    const circle = L.circleMarker([lat, lon], {
      radius: radius
    });
    circle.bindPopup(this.popupService.makeCapitalPopup(properties));
    circle.addTo(this.map);
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
        const latLng = this.shapeService.getLatLonByName(feature.properties.NAME);
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          click: (e) => (this.map.setView(new L.LatLng(latLng[0], latLng[1]),8))
        })
      }
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
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
