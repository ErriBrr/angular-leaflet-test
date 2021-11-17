import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapControllerService {
  map!: L.Map;

  constructor() { }
}
