import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PopupService } from './popup.service';
import { FeaturesDataService } from './features-data.service';
import { MapControllerService } from './map-controller.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    PopupService, 
    FeaturesDataService,
    MapControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
