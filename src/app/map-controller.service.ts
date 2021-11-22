import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';
import * as L from 'leaflet';
import { GeoJsonFeatures } from './feature';
import { CONTINENTS } from './continents';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  private urlTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  map!: L.Map;
  usaStatesLayers: L.GeoJSON = L.geoJSON();
  euroStatesLayers: L.GeoJSON = L.geoJSON();
  usaMarkersLayers: L.LayerGroup = L.layerGroup();
  euroMarkersLayers: L.LayerGroup = L.layerGroup();
  usaMapLayers: L.LayerGroup = L.layerGroup([this.usaStatesLayers, this.usaMarkersLayers]);
  euroMapLayers: L.LayerGroup = L.layerGroup([this.euroStatesLayers, this.euroMarkersLayers]);

  constructor(private popupService: PopupService) {}

  getColor(feature: any) {
    const density = feature.properties.POP2005 / feature.properties.AREA;
    return density > 1000 ? '#800026' :
           density > 500  ? '#BD0026' :
           density > 200  ? '#E31A1C' :
           density > 100  ? '#FC4E2A' :
           density > 50   ? '#FD8D3C' :
           density > 20   ? '#FEB24C' :
           density > 10   ? '#FED976' :
                      '#FFEDA0';
  }

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

    const continents = {
      "USA": this.usaMapLayers,
      "UE": this.euroMapLayers
    };
    const capitals = {
      "USA capitals": this.usaMarkersLayers,
      "UE capitals": this.euroMarkersLayers
    };
    L.control.layers(continents, capitals).addTo(this.map);
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
    const geojson = continent === CONTINENTS.a ? this.usaStatesLayers : this.euroStatesLayers;
    geojson.options = {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: continent === CONTINENTS.e ? this.getColor(feature!) : '#6DB65B'
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => (this.hightlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e, continent)),
          click: (e) => {
            this.map.setView(new L.LatLng(feature.properties.center[0], feature.properties.center[1]),8);
          }
        })
      }
    };
    geojson.addData(geoJson);
  }

  hightlightFeature(e: any) {
    e.target.setStyle({
      weight: 10,
      opacity: 0.5,
      color: '#DFA612',
      fillOpacity: 0.8,
      fillColor: '#FAE042'
    });
  }

  resetFeature(e: any, continent: string) {
    continent === CONTINENTS.a ? this.resetFeatureUSA(e) : this.resetHighlightUE(e);
  }
  
  resetFeatureUSA(e: any) {
    e.target.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

  resetHighlightUE(e: any) {
    this.euroStatesLayers.resetStyle(e.target);
  }

  hideOrShowContinent(continent: string) {
    if (continent === CONTINENTS.e) {
      this.hideOrShowGroup(this.euroMapLayers);
    }
    if (continent === CONTINENTS.a) {
      this.hideOrShowGroup(this.usaMapLayers);
    }
  }

  hideOrShowGroup(g: L.LayerGroup) {
    if (this.map.hasLayer(g)){
      g.removeFrom(this.map);
    } else {
      g.addTo(this.map);
    }
  }

  addMapLayer(layer: any, name: string, continent:string) {
    if (continent === CONTINENTS.e) {
      this.euroMarkersLayers.addLayer(layer);
    } else if (continent === CONTINENTS.a) {
      this.usaMarkersLayers.addLayer(layer);
    }
  }
}
