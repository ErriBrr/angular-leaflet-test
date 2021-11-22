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
  divInfoText = L.DomUtil.create('div', 'info');

  constructor(private popupService: PopupService) {}

  getDensity(feature: any){
    return Math.round(feature.properties.POP2005 / feature.properties.AREA);
  }

  getFeatureColor(feature: any) {
    const density = this.getDensity(feature);
    return this.getDensityColor(density);
  }

  getDensityColor(d: number) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  initInfoText() {
    this.divInfoText.innerHTML = '<h4>State Population Density</h4> Hover over a state';
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

    const legend = new L.Control({position: 'bottomright'});
    legend.onAdd = (map) => {
      const div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<h4>Population Density</h4><i style="background:#6DB65B"></i> unknown <br>';
      const grades = [0, 10, 20, 50, 100, 200, 500, 1000];
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + this.getDensityColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
      return div;
    };
    legend.addTo(this.map);

    const info = new L.Control({position: 'bottomleft'});
    info.onAdd = (map) => {
      return this.divInfoText;
    }
    this.initInfoText();
    info.addTo(this.map);
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
        fillColor: continent === CONTINENTS.e && feature?.properties.AREA > 0 ? this.getFeatureColor(feature!) : '#6DB65B'
      }),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            this.hightlightFeature(e);
            if (continent === CONTINENTS.e && feature?.properties.AREA > 0){
              this.divInfoText.innerHTML = '<h4>State Population Density</h4><b>' + feature.properties.NAME + '</b><br />' + this.getDensity(feature) + ' people / mi<sup>2</sup>';
            }
          },
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
    this.initInfoText();
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
