import { Component, OnInit } from '@angular/core';
import { MapControllerService } from '../map-controller.service';
import { MapLayer } from '../map-layer';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  mapElements: MapLayer[];

  constructor(private mapController: MapControllerService) {
    this.mapElements = [];
    this.mapController.mapLayers.subscribe(elt => this.addMapElt(elt));
  }

  ngOnInit(): void {
  }

  addMapElt(elt: MapLayer){
    this.mapElements.push(elt)
  }

  hideOrShowMapElt(mapElt: MapLayer): void {
    this.mapController.hideOrShowElement(mapElt);
  }
}
