import { Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import { ShapeService } from './shape.service';
import { MapControllerService } from './map-controller.service';
import { FIRST } from './continents';

@Injectable({
  providedIn: 'root'
})
export class InitMapService {

  constructor(
    private markerService: MarkerService,
    private shapeService: ShapeService,
    private mapController: MapControllerService
  ) {}

  public initMap() {
    this.mapController.init();
    this.markerService.init();
    this.shapeService.initStatesLayer();
    this.shapeService.readyFlag.subscribe(b => this.mapController.hideOrShowContinent(FIRST));
  }
}
