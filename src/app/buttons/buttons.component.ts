import { Component, OnInit } from '@angular/core';
import { MapControllerService } from '../map-controller.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {
  continents: string[] = ['america', 'europe']
  select: string = '';

  constructor(private mapController: MapControllerService) {
  }

  ngOnInit(): void {
  }

  hideOrShow(continent: string): void {
    // remove the previous select continent
    if (this.select != "") {
      this.mapController.hideOrShowContinent(this.select);
    }
    this.select = continent;
    // show the newest select continent
    this.mapController.hideOrShowContinent(this.select);
  }
}
