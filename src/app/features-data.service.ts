import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturesDataService {
  private capitalsDataUrl: string = '/assets/data/usa-capitals.geojson';
  private statesDataUrl: string = '/assets/data/gz_2010_us_040_00_5m.json';

  public capitals: Observable<Object> = this.http.get(this.capitalsDataUrl);
  public states: Observable<Object> = this.http.get(this.statesDataUrl);

  constructor(private http: HttpClient) {}

}
