import { Component, OnInit } from '@angular/core';
import { MapControllerService } from '../map-controller.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  continents: string[] = ['america', 'europe']

  constructor(private mapController: MapControllerService) {
  }

  ngOnInit(): void {
  }

  hideOrShow(continent: string): void {
    this.mapController.hideOrShowContinent(continent);
  }
}
