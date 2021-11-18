import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import * as L from 'leaflet';
import { GeoJsonFeatures } from './feature';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private urlTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  map!: L.Map;
  markers = new Subject<L.Marker>();
  circles = new Subject<L.CircleMarker>();
  layers = new Subject<L.Layer>();

  constructor(private popupService: PopupService) {}

  init() {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    L.tileLayer(this.urlTiles, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  addMarker(lat:number, lon:number) {
    const marker = L.marker([lat, lon]);
    marker.addTo(this.map);
    this.markers.next(marker);
  }

  addCircle(lat:number, lon:number, properties:any, radius:number) {
    const circle = L.circleMarker([lat, lon], {
      radius: radius
    });
    circle.bindPopup(this.popupService.makeCapitalPopup(properties));
    circle.addTo(this.map);
    this.circles.next(circle);
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
          click: (e) => {
            this.map.setView(new L.LatLng(feature.properties.center[0], feature.properties.center[1]),8);
          }
        })
      }
    });

    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
    this.layers.next(stateLayer);
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

  hideOrShowElement(e: any) {
    if (this.map.hasLayer(e)){
      e.removeFrom(this.map);
    } else {
      e.addTo(this.map);
    }
  }
}
