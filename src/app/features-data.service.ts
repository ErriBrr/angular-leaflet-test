import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturesDataService {
  private usaCapitalsDataUrl: string = '/assets/data/usa-capitals.geojson';
  private usaStatesDataUrl: string = '/assets/data/gz_2010_us_040_00_5m.json';
  
  private euroCapitalsDataUrl: string = '/assets/data/european-capitals.geojson';
  private euroStatesDataUrl: string = '/assets/data/europe.geojson';

  public usaCapitals: Observable<Object> = this.http.get(this.usaCapitalsDataUrl);
  public usaStates: Observable<Object> = this.http.get(this.usaStatesDataUrl);

  public euroCapitals: Observable<Object> = this.http.get(this.euroCapitalsDataUrl);
  public euroStates: Observable<Object> = this.http.get(this.euroStatesDataUrl);

  constructor(private http: HttpClient) {}

}
