import { Component, OnInit } from '@angular/core';
import { MapControllerService } from '../map-controller.service';

interface mapElt {
  elt: any,
  type: string
}

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  mapElements: mapElt[];

  constructor(private mapController: MapControllerService) {
    this.mapElements = [];
    this.mapController.markers.subscribe(elt => this.addMapElt(elt, 'marker'));
    this.mapController.circles.subscribe(elt => this.addMapElt(elt, 'circle'));
    this.mapController.layers.subscribe(elt => this.addMapElt(elt, 'layer'));
  }

  ngOnInit(): void {
  }

  addMapElt(elt: any, type: string){
    this.mapElements.push({
      elt: elt,
      type: type
    })
  }

  deleteMapElt(mapElt: mapElt): void {
    const id = this.mapElements.findIndex(e => e.elt === mapElt);
    if (id){
      this.mapController.removeElement(mapElt);
      this.mapElements.splice(id!, 1);
    }
  }

}
