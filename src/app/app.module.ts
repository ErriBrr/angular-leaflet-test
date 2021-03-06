import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PopupService } from './popup.service';
import { FeaturesDataService } from './features-data.service';
import { MapControllerService } from './map-controller.service';
import { ShapeService } from './shape.service';
import { MarkerService } from './marker.service';
import { ButtonsComponent } from './buttons/buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ButtonsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    PopupService, 
    FeaturesDataService,
    MapControllerService,
    ShapeService,
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
