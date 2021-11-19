import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import * as L from 'leaflet';
import { GeoJsonFeatures } from './feature';
import { MapLayer } from './map-layer';
import { CONTINENTS } from './continents';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private urlTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  map!: L.Map;
  usaMapLayers: MapLayer[] = [];
  euroMapLayers: MapLayer[] = [];
  private bringToBackList: any[] = [];

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

  addMarker(lat:number, lon:number, continent:string) {
    const marker = L.marker([lat, lon]);
    this.addMapLayer(marker, 'marker', continent);
  }

  addCircle(lat:number, lon:number, properties:any, radius:number, continent:string) {
    const circle = L.circleMarker([lat, lon], {
      radius: radius
    });
    circle.bindPopup(this.popupService.makeCapitalPopup(properties));
    this.addMapLayer(circle, properties.name, continent);
  }

  addStatesLayer(geoJson: GeoJsonFeatures, continent:string) {
    const stateLayer = L.geoJSON(geoJson, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => {
        this.bringToBackList.push(layer);
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          click: (e) => {
            this.map.setView(new L.LatLng(feature.properties.center[0], feature.properties.center[1]),8);
          }
        })
      }
    });

    this.bringToBackList.push(stateLayer);
    this.addMapLayer(stateLayer, 'layer', continent);
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

  hideOrShowContinent(continent: string) {
    if (continent === CONTINENTS.e) {
      this.euroMapLayers.forEach(e => this.hideOrShowElement(e));
    }
    if (continent === CONTINENTS.a) {
      this.usaMapLayers.forEach(e => this.hideOrShowElement(e));
    }
  }

  hideOrShowElement(e: MapLayer) {
    if (this.map.hasLayer(e.layer)){
      e.layer.removeFrom(this.map);
    } else {
      e.layer.addTo(this.map);
      if (this.bringToBackList.find(elt => elt === e.layer)) {
        e.layer.bringToBack();
      }
    }
  }

  addMapLayer(layer: any, name: string, continent:string) {
    if (continent === CONTINENTS.a) {
      this.usaMapLayers.push({
        layer: layer,
        name: name
      });
    }
    if (continent === CONTINENTS.e) {
      this.euroMapLayers.push({
        layer: layer,
        name: name
      });
    }
  }
}
