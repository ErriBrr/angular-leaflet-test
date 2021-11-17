import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CapitalsFeature, StatesFeature } from './feature';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturesDataService {
  private statesDataUrl: string = '/assets/data/gz_2010_us_040_00_5m.json';  
  private capitalsDataUrl: string = '/assets/data/usa-capitals.geojson';

  private capitals = new Subject<CapitalsFeature[]>();
  private states = new Subject<StatesFeature[]>();

  constructor(private http: HttpClient) {
    this.http.get(this.statesDataUrl).subscribe(data => {
      const anyStates: any = data;
      this.states.next(anyStates.features);
    });
    this.http.get(this.capitalsDataUrl).subscribe(data => {
      const anyCapitals: any = data;
      this.capitals.next(anyCapitals.features);
    });
  }

  getCapitals(): Subject<CapitalsFeature[]> {
    return this.capitals;
  }
  getStates(): Subject<StatesFeature[]> {
    return this.states;
  }
}
